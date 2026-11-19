# Doctor Tracker — Backend

Express REST API for Doctor Tracker: JWT cookie auth, doctors & patients CRUD with search/filter/pagination, and MongoDB dashboard aggregations.

**Frontend repo:** [doctor-tracker-frontend](https://github.com/code-with-rifat/doctor-tracker-frontend)

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (httpOnly cookie) + bcrypt
- Zod validation
- Helmet, CORS, rate limit, mongo sanitize

## Setup

Requirements: Node.js 18+, MongoDB (local or Atlas)

1. Copy env example (never commit real secrets):

```bash
copy .env.example .env
```

`.env.example`:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/doctor-tracker
JWT_SECRET=change-this-to-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

2. Install, seed, run:

```bash
npm install
npm run seed
npm run dev
```

API: [http://localhost:5000](http://localhost:5000)

To create or reset the demo admin and add sample doctors/patients without clearing existing data:

```bash
npm run seed-demo
```

### Demo admin

- Email: `demo@doctortracker.com`
- Password: `Demo@123`

The demo login button is available in the frontend during development.

### Demo admin (after seed)

- Email: `admin@doctortracker.com`
- Password: `Admin@123`

Seed creates ~25 doctors and ~150 patients.

## Main API routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Current admin |
| GET/POST | `/api/doctors` | List / create doctors |
| GET/PUT/DELETE | `/api/doctors/:id` | Doctor detail / update / delete |
| GET/POST | `/api/patients` | List / create patients |
| GET/PUT/DELETE | `/api/patients/:id` | Patient detail / update / delete |
| GET | `/api/dashboard/summary` | Stats + chart data |

List endpoints support search, filters, pagination (`page`, `limit`).

## Deploy (Vercel)

This API is Vercel-ready via `vercel.json` + `api/index.js`.

1. Create a MongoDB Atlas cluster and get `MONGODB_URI`
2. Import this repo into Vercel (Root Directory = repo root)
3. Set Environment Variables:

```
MONGODB_URI=<atlas-uri>
JWT_SECRET=<long-random-secret>
CLIENT_ORIGIN=https://<your-frontend>.vercel.app
NODE_ENV=production
JWT_EXPIRES_IN=7d
```

4. Seed Atlas once from your machine (with Atlas URI in `.env`):

```bash
npm run seed
```

5. Point frontend `NEXT_PUBLIC_API_URL` to `https://<your-backend>.vercel.app/api`

Health check: `GET /api/health`

## Author

Riazul Islam Rifat
