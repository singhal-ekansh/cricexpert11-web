# CricRatings Web

Next.js frontend for the CricRatings draft game.

Inspired by [500/0](https://500-0.com/) — dark gold aesthetic, data-forward draft UI.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Ensure the backend API is running (from the CricRatings repo):

```bash
cd ../CricRatings
cricratings-api
# → http://localhost:8000
```

## Run

```bash
npm run dev
# → http://localhost:3000
```

## Game flow

1. **Home** — personal best from `localStorage`
2. **Play** — `POST /api/v1/game/start` once (11 pools generated)
3. **11 draft rounds** — pick 1 player per pool
4. **Lineup** — assign slots 1–11 freely, reshuffle until submit
5. **Score** — `POST /api/v1/game/score` once
6. Best score saved to browser `localStorage`

## API (2 calls per game)

| Call | Endpoint |
|------|----------|
| Start | `POST /api/v1/game/start` |
| Score | `POST /api/v1/game/score` |
