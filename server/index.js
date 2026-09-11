import 'dotenv/config';
import crypto from 'node:crypto';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { WebSocketServer } from 'ws';
import { createAssignment, nextCandidate, rankPartners } from './assignment.js';
import { createMongoStore } from './mongo-store.js';
import { createSupabaseStore } from './supabase-store.js';

const app = express();
const server = http.createServer(app);
const websocketServer = new WebSocketServer({ server, path: '/ws' });
const port = Number(process.env.PORT || process.env.DELIVERY_PORT || 8787);
const radiusKm = Number(process.env.DELIVERY_RADIUS_KM || 15);
const responseTimeoutMs = Number(process.env.PARTNER_RESPONSE_TIMEOUT_MS || 60000);
const assignments = new Map();
const orders = new Map();
const timers = new Map();
const dataStore = createSupabaseStore() || await createMongoStore();

const partners = [
  { id: 'anil-kumar', name: 'Anil Kumar', vehicle: 'Bike', capacityKg: 20, rating: 4.8, activeOrders: 1, available: true, averageSpeedKph: 28, location: { lat: 17.385, lng: 78.4867 } },
  { id: 'meena-logistics', name: 'Meena Logistics', vehicle: 'Auto', capacityKg: 300, rating: 4.6, activeOrders: 2, available: true, averageSpeedKph: 24, location: { lat: 17.42, lng: 78.45 } },
  { id: 'greenroute-partner', name: 'GreenRoute Partner', vehicle: 'Mini Truck', capacityKg: 1500, rating: 4.9, activeOrders: 0, available: true, averageSpeedKph: 30, location: { lat: 17.31, lng: 78.52 } },
  { id: 'deccan-truck', name: 'Deccan Farm Truck', vehicle: 'Truck', capacityKg: 5000, rating: 4.5, activeOrders: 4, available: true, averageSpeedKph: 32, location: { lat: 17.48, lng: 78.39 } }
];

app.use(express.json());
const publicDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
app.use(express.static(publicDirectory));
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (request.method === 'OPTIONS') return response.sendStatus(204);
  next();
});

function broadcast(message) {
  const payload = JSON.stringify(message);
  websocketServer.clients.forEach((client) => {
    if (client.readyState === 1) client.send(payload);
  });
}

async function notifyPartner(partner, assignment) {
  broadcast({ type: 'partner_notification', partnerId: partner.id, assignmentId: assignment.id, vehicleRecommendation: assignment.vehicleRecommendation });
  if (!process.env.FIREBASE_PROJECT_ID) return { provider: 'websocket', delivered: true };
  try {
    const firebase = await import('firebase-admin');
    if (!firebase.default.apps.length) firebase.default.initializeApp();
    return { provider: 'firebase', delivered: Boolean(partner.pushToken && await firebase.default.messaging().send({ token: partner.pushToken, data: { assignmentId: assignment.id, type: 'delivery_assignment' } })) };
  } catch (error) {
    return { provider: 'websocket', delivered: false, error: error.message };
  }
}

async function getGoogleTravelTime(origin, destination) {
  if (!process.env.GOOGLE_MAPS_API_KEY) return null;
  const params = new URLSearchParams({ origins: `${origin.lat},${origin.lng}`, destinations: `${destination.lat},${destination.lng}`, key: process.env.GOOGLE_MAPS_API_KEY });
  const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?${params}`);
  if (!response.ok) return null;
  const payload = await response.json();
  const seconds = payload.rows?.[0]?.elements?.[0]?.duration?.value;
  return Number.isFinite(seconds) ? Math.ceil(seconds / 60) : null;
}

function clearAssignmentTimer(assignmentId) {
  const timer = timers.get(assignmentId);
  if (timer) clearTimeout(timer);
  timers.delete(assignmentId);
}

async function assignCandidate(assignment) {
  const candidate = assignment.candidates[assignment.currentCandidateIndex];
  if (!candidate) {
    assignment.status = 'unassigned';
    broadcast({ type: 'assignment_unassigned', assignment });
    return assignment;
  }
  assignment.assignedPartnerId = candidate.partner.id;
  assignment.status = 'partner_notified';
  assignment.notifiedAt = new Date().toISOString();
  clearAssignmentTimer(assignment.id);
  await notifyPartner(candidate.partner, assignment);
  broadcast({ type: 'assignment_updated', assignment });
  timers.set(assignment.id, setTimeout(async () => {
    const current = assignments.get(assignment.id);
    if (!current || current.status !== 'partner_notified') return;
    const fallback = nextCandidate(current);
    if (!fallback) {
      current.status = 'unassigned';
      broadcast({ type: 'assignment_unassigned', assignment: current, reason: 'response_timeout' });
      return;
    }
    assignments.set(assignment.id, fallback);
    await assignCandidate(fallback);
  }, responseTimeoutMs));
  return assignment;
}

app.get('/health', (request, response) => response.json({ ok: true, service: 'farmdirect-delivery', integrations: { maps: Boolean(process.env.GOOGLE_MAPS_API_KEY), firebase: Boolean(process.env.FIREBASE_PROJECT_ID), mongodb: Boolean(process.env.MONGODB_URI) } }));
app.get('/', (request, response) => response.sendFile(path.join(publicDirectory, 'index.html')));
app.get('/api/partners', (request, response) => response.json({ partners, radiusKm }));

app.post('/api/orders/:orderId/confirm', async (request, response) => {
  const order = { ...request.body, id: request.params.orderId, weightKg: Number(request.body.weightKg ?? request.body.quantity ?? 0) };
  if (!order.pickup || !order.dropoff) return response.status(400).json({ error: 'pickup and dropoff coordinates are required' });
  const assignment = createAssignment({ order, partners, radiusKm });
  assignment.pickupVerification = { otp: String(Math.floor(100000 + Math.random() * 900000)), verified: false };
  assignment.deliveryVerification = { otp: String(Math.floor(100000 + Math.random() * 900000)), verified: false };
  assignment.payment = { status: 'held', releasedAt: null };
  orders.set(order.id, order);
  assignments.set(assignment.id, assignment);
  await dataStore?.saveOrder(order);
  await dataStore?.saveAssignment(assignment);
  await assignCandidate(assignment);
  response.status(201).json({ order, assignment, mapsProvider: process.env.GOOGLE_MAPS_API_KEY ? 'google_maps' : 'haversine_fallback' });
});

app.post('/api/assignments/:assignmentId/respond', async (request, response) => {
  const assignment = assignments.get(request.params.assignmentId);
  if (!assignment) return response.status(404).json({ error: 'assignment not found' });
  const { partnerId, response: partnerResponse } = request.body;
  if (assignment.assignedPartnerId !== partnerId) return response.status(409).json({ error: 'partner is not the current candidate' });
  clearAssignmentTimer(assignment.id);
  if (partnerResponse === 'accept') {
    assignment.status = 'accepted';
    assignment.acceptedAt = new Date().toISOString();
    await dataStore?.saveAssignment(assignment);
    broadcast({ type: 'assignment_accepted', assignment });
    return response.json(assignment);
  }
  const fallback = nextCandidate(assignment);
  if (!fallback) {
    assignment.status = 'unassigned';
    broadcast({ type: 'assignment_unassigned', assignment, reason: 'partner_declined' });
    return response.json(assignment);
  }
  assignments.set(assignment.id, fallback);
  await dataStore?.saveAssignment(fallback);
  await assignCandidate(fallback);
  response.json(fallback);
});

app.get('/api/assignments/:assignmentId', (request, response) => {
  const assignment = assignments.get(request.params.assignmentId);
  if (!assignment) return response.status(404).json({ error: 'assignment not found' });
  response.json(assignment);
});

app.post('/api/assignments/:assignmentId/location', (request, response) => {
  const assignment = assignments.get(request.params.assignmentId);
  if (!assignment) return response.status(404).json({ error: 'assignment not found' });
  assignment.liveLocation = { ...request.body, updatedAt: new Date().toISOString() };
  broadcast({ type: 'location_updated', assignmentId: assignment.id, location: assignment.liveLocation });
  response.json(assignment.liveLocation);
});

app.get('/api/assignments/:assignmentId/eta', async (request, response) => {
  const assignment = assignments.get(request.params.assignmentId);
  if (!assignment) return response.status(404).json({ error: 'assignment not found' });
  const candidate = assignment.candidates[assignment.currentCandidateIndex];
  const googleMinutes = candidate ? await getGoogleTravelTime(candidate.partner.location, orders.get(assignment.orderId)?.dropoff) : null;
  const etaMinutes = googleMinutes || candidate?.travelTimeMinutes || null;
  assignment.eta = { minutes: etaMinutes, updatedAt: new Date().toISOString(), provider: googleMinutes ? 'google_maps' : 'estimated' };
  broadcast({ type: 'eta_updated', assignmentId: assignment.id, eta: assignment.eta });
  response.json(assignment.eta);
});

function verifyStep(assignment, step, code, qrToken) {
  const verification = assignment[step];
  const valid = (code && code === verification.otp) || (qrToken && qrToken === verification.qrToken);
  if (valid) verification.verified = true;
  return valid;
}

app.post('/api/assignments/:assignmentId/pickup/verify', (request, response) => {
  const assignment = assignments.get(request.params.assignmentId);
  if (!assignment) return response.status(404).json({ error: 'assignment not found' });
  assignment.pickupVerification.qrToken ||= crypto.randomUUID();
  if (!verifyStep(assignment, 'pickupVerification', request.body.otp, request.body.qrToken)) return response.status(401).json({ error: 'invalid pickup OTP or QR token' });
  assignment.status = 'in_transit';
  broadcast({ type: 'pickup_verified', assignment });
  response.json(assignment);
});

app.post('/api/assignments/:assignmentId/delivery/verify', (request, response) => {
  const assignment = assignments.get(request.params.assignmentId);
  if (!assignment) return response.status(404).json({ error: 'assignment not found' });
  assignment.deliveryVerification.qrToken ||= crypto.randomUUID();
  if (!verifyStep(assignment, 'deliveryVerification', request.body.otp, request.body.qrToken)) return response.status(401).json({ error: 'invalid delivery OTP or QR token' });
  assignment.status = 'delivered';
  assignment.payment.status = 'released';
  assignment.payment.releasedAt = new Date().toISOString();
  broadcast({ type: 'delivery_confirmed', assignment, payment: assignment.payment });
  response.json(assignment);
});

websocketServer.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'connected', service: 'farmdirect-delivery' }));
});

server.listen(port, () => console.log(`FarmDirect delivery service listening on http://localhost:${port}`));
