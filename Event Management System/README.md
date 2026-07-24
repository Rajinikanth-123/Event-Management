# Event Management System

A production-ready MERN event management platform with JWT authentication, admin workflows, QR ticketing, email confirmations, responsive UI, and deployment-ready configuration for Vercel and Render.

## Tech Stack

- Frontend: React, React Router, Axios, Context API, responsive CSS
- Backend: Node.js, Express, MongoDB Atlas, Mongoose
- Auth: JWT, bcrypt
- Email: Nodemailer
- Tickets: qrcode
- Security: Helmet, rate limiting, CORS, validation

## Project Structure

- `client/` React frontend
- `server/` Express API

## Setup

1. Install dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

2. Configure environment variables:

- `server/.env`
- `client/.env`

3. Run the app:

```bash
npm run dev
```

## Environment Variables

### Server

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email
MAIL_PASS=your_password
MAIL_FROM="Event Management <noreply@example.com>"
APP_NAME=Event Management System
```

### Client

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Event Management System
```

## Deployment

- Frontend: deploy `client` to Vercel
- Backend: deploy `server` to Render or Railway
- Set the production API URL in the client environment
- Point MongoDB to Atlas

## Notes

- The backend exposes REST endpoints for auth, events, registrations, and admin dashboards.
- The frontend uses a context-driven auth flow, protected routes, reusable components, and responsive layouts.
- QR codes are generated on registration and emailed to the attendee.
