# Book Store (complete-mongo)

A small full-stack example application demonstrating a Node/Express + MongoDB backend with an Angular frontend for managing books and users (authentication, CRUD, pagination).

## Technology stack

- Backend: Node.js, Express
- Database: MongoDB (mongoose + mongodb drivers)
- Auth: JWT (jsonwebtoken), bcrypt for password hashing
- Frontend: Angular 20 (TypeScript)
- Utilities: dotenv, cors

Versions (from package.json):

- Angular: ~20.2
- Node dependencies include `mongoose` ^8, `mongodb` ^6, `jsonwebtoken` ^9

## Project architecture

This is a traditional 2-tier web app:

- Client (Angular SPA) served separately during development via `ng serve` (proxy to API).
- Server (Express) exposes a JSON REST API under `/api/*` with JWT-based authentication.
- MongoDB stores `Book` and `User` documents (see `models/Book.js` and `models/User.js`).

Key flows:

- Register -> POST `/api/register` -> creates User
- Login -> POST `/api/login` -> returns JWT
- CRUD Books -> `/api/books` (protected by `authenticateToken` middleware)

## Getting started

Prerequisites:

- Node.js (LTS)
- MongoDB (local or Atlas)
- npm

Quick start (backend):

1. Copy `.env` or create one in the project root with at least:

```
MONGODB_URI=mongodb://localhost:27017/bookstore
PORT=3000
JWT_SECRET=your_jwt_secret
```

2. Install and run backend:

```
# in project root
npm install
node app.js
```

Quick start (frontend):

1. Install and run the Angular app:

```
cd frontend
npm install
npm start
```

The frontend uses a proxy (`frontend/proxy.conf.json`) to forward API requests to the backend during development.

## Project structure

- `app.js` - Express server, routes, and auth middleware
- `db.js` - MongoDB connection helper
- `models/Book.js`, `models/User.js` - Mongoose models
- `frontend/` - Angular application
  - `src/app/` - Angular components and services

## Key features

- User registration and login with JWT authentication
- Protected CRUD endpoints for books with pagination
- Basic input validation and error handling

## Development workflow

- Backend and frontend are developed separately. Start the backend (`node app.js`) and run the Angular dev server (`npm start` inside `frontend`).
- Use the `frontend` proxy to route API calls to the running backend.

## Coding standards (excerpt from `frontend/.github/copilot-instructions.md`)

- TypeScript: use strict checking, avoid `any`, prefer `unknown` when needed.
- Angular: prefer standalone components, use signals for state, lazy-load routes, prefer reactive forms.
- Components: small single-responsibility components, `changeDetection: OnPush`, prefer inline templates for small components.
- Services: single responsibility, `providedIn: 'root'`, prefer `inject()`.

Refer to `frontend/.github/copilot-instructions.md` for the full guidance.

## Testing

- The repository contains an Angular test setup (Karma/Jasmine) in `frontend`.
- Backend: no automated tests included by default. Consider adding Jest or Mocha/Chai for API tests and supertest for endpoint testing.

## Contributing

- Follow the coding standards in `frontend/.github/copilot-instructions.md` for frontend work.
- Open issues or PRs against the `main` branch and include clear descriptions and repro steps.

## License

This repository does not include an explicit license file. Add a `LICENSE` to clarify reuse rights.

---

Files referenced:

- `app.js`, `db.js` - backend entrypoints
- `models/Book.js`, `models/User.js` - data models
- `frontend/` - Angular project

