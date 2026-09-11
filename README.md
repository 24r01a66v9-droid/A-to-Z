# Farmers A to Z Web

FarmDirect is a direct farm-to-consumer marketplace for fair pricing, traceable produce, and transparent savings.

## Run locally

**Prerequisite:** Node.js 18 or newer.

```powershell
npm install
npm run dev
```

## Platform architecture

The website is a React/Vite frontend. Browser state currently keeps the demo marketplace inventory and order cache in `localStorage`, while confirmed orders can call the Node delivery service at `http://localhost:8787`.

### Backend services

- **Node.js + Express:** order confirmation, delivery assignment, partner responses, fallback reassignment, OTP/QR verification, payment-release state, and REST APIs.
- **WebSockets:** live assignment, partner notification, GPS location, ETA, pickup, and delivery events at `/ws`.
- **Supabase:** preferred production persistence through the server-only service-role client. Orders are stored in `orders`; assignments are stored in `delivery_assignments`.
- **MongoDB:** optional compatibility fallback when Supabase variables are absent.
- **FastAPI:** optional AI service in `ai_service.py`, exposing `/recommend-vehicle` for vehicle recommendations.

Start the services locally:

```powershell
npm run delivery
npm run dev
uvicorn ai_service:app --reload --port 8000
```

### Delivery assignment algorithm

When an order is confirmed, the service filters partners by configured radius, availability, and vehicle capacity. It then scores each candidate using distance, estimated travel time, rating, spare capacity, and active workload. The highest score is notified first. A decline or 60-second timeout moves the assignment to the next ranked candidate.

Vehicle recommendation thresholds are: Bike up to 20 kg, Auto 20-300 kg, Mini Truck 300-1500 kg, and Truck above 1500 kg.

### Mapping and live delivery

Without a key, the service uses a Haversine distance estimate so local development works offline. Set `GOOGLE_MAPS_API_KEY` to use Google Distance Matrix for ETA updates. Partner GPS updates are posted to `/api/assignments/:assignmentId/location` and broadcast to WebSocket clients.

### Supabase setup

Create these tables in Supabase SQL Editor:

```sql
create table public.orders (
	id text primary key,
	payload jsonb not null,
	updated_at timestamptz not null default now()
);

create table public.delivery_assignments (
	id text primary key,
	order_id text not null,
	status text not null,
	payload jsonb not null,
	updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.delivery_assignments enable row level security;
```

Configure the delivery service with a `.env` file or deployment secrets:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=server-only-key
FRONTEND_ORIGIN=http://localhost:5173
DELIVERY_RADIUS_KM=15
PARTNER_RESPONSE_TIMEOUT_MS=60000
GOOGLE_MAPS_API_KEY=optional
FIREBASE_PROJECT_ID=optional
```

Never expose `SUPABASE_SERVICE_ROLE_KEY`, Firebase credentials, Google Maps server keys, or database URLs in React code or `VITE_*` variables. The browser should use authenticated user sessions and the Express API; Supabase Row Level Security should remain enabled, with policies added for farmer, buyer, and delivery-partner ownership.

### Security and data management

- Keep all secrets in deployment environment variables and rotate them regularly.
- Restrict `FRONTEND_ORIGIN` to the real frontend origin in production; do not use `*` outside local development.
- Validate order weight, coordinates, partner IDs, OTPs, and QR tokens on the server before changing status.
- Use HTTPS/WSS, rate-limit login and verification endpoints, and require authenticated farmer/buyer/partner sessions.
- Store only the minimum buyer address and contact data needed for fulfillment; define retention and deletion rules.
- Hash or encrypt OTPs and sensitive delivery data in production rather than keeping demo values in assignment payloads.
- Release payment only after server-side delivery verification, and record an immutable status history for disputes.
- Use Supabase RLS policies and audit logs for row access; never query production tables directly from an untrusted client.

The current repository includes the working demo flow and adapters. Authentication policies, production payment provider integration, real device GPS permissions, and final Supabase RLS policies should be completed before deployment.

Open the local URL printed by Vite, usually `http://localhost:5173/`.

The web app includes:

- Marketplace search, category filters, produce listings, and direct ordering
- Browser-persisted orders and inventory updates
- Zero Cut savings calculator
- Orders and cumulative savings view
- Farmer Hub with listing management and incoming orders

Data is stored in the browser with `localStorage`; no API key or backend is required for the local demo.

## Production build

```powershell
npm run build
npm run preview
```
