# Farmers A to Z Web

FarmDirect is a direct farm-to-consumer marketplace for fair pricing, traceable produce, and transparent savings.

## Run locally

**Prerequisite:** Node.js 18 or newer.

```powershell
npm install
npm run dev
```

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
