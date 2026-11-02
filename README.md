# REMMY

REMMY is an AI-powered personal memory and knowledge retrieval app. The initial product focus is saving and finding useful information from Instagram Reels.

## Current state

This repository contains the initial Expo Router and TypeScript application scaffold. Its Home and Explore screens are still template examples; authentication, Reel ingestion, search, persistence, and backend services have not been implemented.

## Development

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Run on web:

```bash
npm run web
```

Check types and lint:

```bash
npx tsc --noEmit
npm run lint
```

## Project structure

- `src/app/` — Expo Router routes and layouts.
- `src/components/` — reusable UI components.
- `src/constants/` — shared theme and layout constants.
- `assets/` — app assets, including the REMMY logo in `assets/images/remmy-logo.png`.
