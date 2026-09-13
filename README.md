# Ripple — simple React starter

A deliberately simple React + Vite prototype of the Ripple incident feed.

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Structure

- `src/main.jsx` — all prototype data, feed behavior, filters and interactions
- `src/styles.css` — mobile-first UI styling
- `index.html` — basic Vite entry

## Current prototype

- Manipal location header
- Nearby / Taluka / District / State distance filters
- Recency-ordered event cards
- Middle-reference-style large image cards
- Confirm / Not here interactions
- Bottom navigation
- No backend yet

## Next step

Add Supabase after the UI/data model is settled. Suggested first tables: `reports`, `report_verifications`, `profiles`, and `locations`.
