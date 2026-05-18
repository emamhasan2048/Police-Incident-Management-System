# Future Traffic Cases

Next.js + MongoDB traffic violation case registry.

## Setup

1.  `.env.local`.
2.  Set `MONGODB_URI` to your MongoDB server.
3.  Install dependencies with `npm install`.
4.  Run `npm run dev`.
5.  Open `http://localhost:3000/api/seed` once to load sample database data.

All pages read from MongoDB. The register form writes a new case to MongoDB.
