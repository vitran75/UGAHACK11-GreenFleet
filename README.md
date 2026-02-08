# GreenFleet — Sustainability Fleet & Dispatch Manager

Built for **UGAHacks 11**. A real-time fleet management app for battery recycling operations across Ford dealerships. Tracks battery fill levels, visualizes fleet status on interactive maps, plans optimized pickup routes, and includes an AI-powered recyclability analyzer and chatbot.

## Features

### Item Analyzer (Landing Page)
Upload an image of any item and get an AI-powered recyclability analysis — grade (A–F), decomposition time, fun facts, and estimated CO2/water/energy savings. Powered by Google Gemini 2.0 Flash Lite.

### Dashboard
- **KPI cards**: Batteries recycled, suggested pickups, batteries in field, water saved
- **Impact trend chart**: 7-day history + 7-day projection, updates every 60 seconds
- **Operational pulse**: Average days to full, dealers at risk, active centers, recovered material
- **Priority pickups**: Top 5 most urgent dealerships by days-to-full
- **GreenFleet AI chatbot**: Context-aware assistant that knows about your fleet data, routes, and sustainability metrics

### Fleet Map (`/nearby`)
- Interactive Leaflet map showing dealerships, recycling centers, and zero-waste locations
- Searchable/filterable dealer list (by name, city, risk level, days-to-full)
- Detail drawer with battery capacity, fill rate, and schedule-pickup action
- Add/edit dealerships via modal

### Dispatch & Route Planner (`/dispatch`)
- Auto-generates optimized pickup routes for dealerships within 7 days of full capacity
- Nearest-neighbor routing with constraints (max 8 stops, 900 batteries, 250 miles per route)
- Color-coded route visualization on the map
- Stop-by-stop breakdown with distance and battery counts

### Live Simulation
- In-memory mock data with a 60-second update cycle
- Battery counts increase by each dealership's fill rate every tick
- Auto-pickup simulation every 30 seconds (picks the fullest dealership)
- Pub/sub pattern — all subscribed components update in real time

### Notifications
- Toast alerts at 85% capacity (warning) and 90% (error)
- Auto-dismiss after 5 seconds, max 2 shown at once

### Auth
- Email/password login and signup via Supabase
- Protected routes for dashboard, map, dispatch, profile, and settings

## Data Model

| Entity | Count | Description |
|--------|-------|-------------|
| Ford dealerships | 14 | LA, AZ, OH, GA, CA — each with battery count, capacity, and fill rate |
| Recycling centers | 2 | Atlanta, GA and Dallas, TX |
| Zero-waste locations | 7 | Cox Communications, Cox Media Group, AJC distribution, Xtime HQ |

## Tech Stack

- **Next.js 15** (App Router) + **React 18** — client-side pages with `'use client'`
- **Supabase** — authentication only
- **Leaflet + react-leaflet** — maps (OpenStreetMap tiles, dynamic import with SSR disabled)
- **Google Generative AI** (Gemini 2.0 Flash Lite) — item analysis API + fleet chatbot
- **Pure CSS** — custom styling in `globals.css`, no Tailwind/Bootstrap

## Project Structure

```
app/
  page.js              # Landing page with item analyzer
  layout.js            # Root layout + providers
  globals.css          # All styles
  login/ signup/ about/       # Public pages
  dashboard/ nearby/ dispatch/ profile/ settings/  # Protected pages
  api/
    analyze-item/route.js     # Gemini image analysis endpoint
    chat/route.js             # Gemini chatbot endpoint
components/            # 25+ React components (maps, drawers, modals, cards, etc.)
context/               # AuthContext, NotificationContext, SidebarContext
lib/
  mock-data.js         # Fleet simulation engine + pub/sub
  route-planner.js     # Nearest-neighbor route optimization
  fleet-utils.js       # Risk levels, distance calc, filtering
  supabase.js          # Supabase client init
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` with your keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   GOOGLE_API_KEY=<your-google-generative-ai-key>
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)
