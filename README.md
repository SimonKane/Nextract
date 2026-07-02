# Nextract

**Nextract is an early-stage showcase prototype for making API-based product feeds easier to use.**

It was built for second-hand and small online merchants who want to work with product APIs without needing deep API knowledge. Instead of digging through very large API responses manually, the user can load product data, choose the keys that matter, save a cleaned feed, select products and preview how those products could look in a simple HTML storefront.

## Highlights

- Built during our first year at Chas Academy
- Finalist in Chas Challenge, where the team finished in second place
- Designed for non-technical users who want a simpler way to work with API commerce
- Prepared as a frontend-first showcase that works without a live backend
- Includes fallback/demo data so the main flow can be reviewed independently

## Project Status

Nextract is **not a finished product**. It is a first-year prototype in a basic stage, but with clear potential for further development.

The core idea is to help users handle product feeds through a simple interface:

1. Load API or product data
2. Select relevant keys
3. Save a cleaned product feed
4. Choose products for a page
5. Preview or download a basic HTML concept

Future development would focus on handling larger and more complex APIs, stronger data mapping, better generated HTML suggestions and production-ready backend integrations.

## Showcase Version

This repository is prepared so the frontend can run and be reviewed without a live backend.

What works in the showcase:

- Landing page and sign up/login flow
- Dashboard with demo activity and saved product feeds
- API/data flow with fallback demo data
- JSON and CSV upload directly in the browser
- Field selection, preview and local save/update using `localStorage`
- Product selection, product preview and a downloadable HTML preview concept
- Local fallback response for the chat helper when the AI/backend service is unavailable

The download/preview flow is currently basic and should be seen as a concept for how generated HTML suggestions could work after selecting products.

## Tech Stack

- Next.js 15, React 19 and TypeScript
- Zustand
- React Hook Form
- React JSON View Lite
- Motion
- DaisyUI/Tailwind CSS
- Express, Prisma and Node.js in the optional backend

## Run Frontend

```bash
cd frontend-dashboard-main
npm ci
npm run dev
```

Open:

```text
http://localhost:3001
```

Production build:

```bash
npm run build
```

## Backend

The backend lives in `backend-dashboard-main` and is kept for code review and future development. It contains the original database, upload, auth, contact and chat endpoints.

The showcase frontend does not require the backend to run. The backend prototype expects environment variables, a configured database and external service keys for full functionality.
