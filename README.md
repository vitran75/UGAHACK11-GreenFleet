# UGAHACK11 — Sustainability Fleet & Dispatch Demo

This is a Next.js demo for tracking battery recycling operations, routing pickups, and visualizing sustainability impact in real time.

## What This Project Does
- **Fleet Map** shows dealerships and company centers on a live map.
- **Dispatch** builds routes for dealerships nearing full capacity and shows suggested pickup routes.
- **Dashboard** summarizes sustainability impact and operational status.
- **Notifications** alert at 85% (warning) and 90% (error) capacity.

## How To Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the app at `http://localhost:3000`.

> Note: Auth uses Supabase. If you want real auth, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your environment.

## Demo Notes — How It Works (Current)

### Live Simulation
- The system runs on mock data that updates every 60 seconds.
- Each dealership has a battery fill rate; counts increase on each tick.
- When a pickup is simulated, that dealership’s count resets to 0 and totals update.

### Routes / Dispatch
- Routes are recomputed on every update tick (no manual refresh needed).
- A dealership is eligible when days-to-full <= 7 days.
- Eligible dealerships are grouped by nearest company center (zero‑waste locations).
- Routes are built with limits: max stops, max miles, max batteries.
- If the data changes on the next tick, routes can appear, change, or disappear.

### Fleet Map
- Clicking a dealership zooms into it and opens the popup.
- The right drawer shows details and actions for the selected location.

### Notifications
- Warning at 85% capacity, error at 90% capacity.
- Max of 2 notifications shown at once.

### Dashboard / Impact
- Dashboard shows sustainability impact metrics and a dot‑chart.
- The dot chart shows past 7 days from simulated-day snapshots and next 7 days as projection.
- Chart updates automatically every 60 seconds (and after pickups).
