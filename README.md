# Nextract

Nextract is a showcase version of a product-data selection tool for small businesses. The app helps a user load product data, choose the fields that matter, save a cleaned feed, select products, preview a storefront-style page and download the result.

The project was built as a Chas Academy project for Chas Challenge, where the team reached the final and finished in second place.

## Showcase Status

This repository is prepared so the frontend can be run and reviewed without a live backend.

What works in the showcase version:

- Landing page and sign up/login flow
- Dashboard with demo activity and saved product feeds
- API/data flow with fallback demo data when no API URL is provided or a request fails
- JSON and CSV upload directly in the browser
- Field selection, preview and local save/update using `localStorage`
- Product selection, product preview and downloadable preview page
- Local fallback response for the chat helper when the AI/backend service is unavailable

The Express/Prisma backend is still included for code review and future development. It contains the original database, upload, auth, contact and chat endpoints, but the showcase frontend does not require it to run.

## Tech Stack

- Next.js 15, React 19 and TypeScript
- Zustand for client state
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

Open `http://localhost:3001`.

To create a production build:

```bash
npm run build
```

## Optional Backend

The backend lives in `backend-dashboard-main`. It was part of the original full-stack prototype and expects environment variables, a database and external services for features such as auth, persistence, uploads, email and chat. For portfolio review, start with the frontend showcase first.
