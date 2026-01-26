# AGENTS.md

## Project Overview

Book Store is a full-stack web application for managing books and users, featuring authentication, CRUD operations, and pagination. The backend is built with Node.js/Express and MongoDB (Mongoose), while the frontend is a modern Angular 20+ SPA. Authentication is handled via JWT, and the project uses Docker Compose for local MongoDB setup.

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** Angular 20+ (TypeScript)
- **Authentication:** JWT (jsonwebtoken), bcrypt
- **DevOps:** Docker Compose for MongoDB, dotenv for config

---

## Setup Commands

### Prerequisites
- Node.js (LTS recommended)
- MongoDB (local or via Docker Compose)
- npm (Node package manager)

### Backend Setup
1. Create a `.env` file in the project root with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bookstore
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node app.js
   ```

#### (Optional) Start MongoDB with Docker Compose
```bash
docker compose -f mongodb.yaml up -d
```

### Frontend Setup
1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Angular development server (with API proxy):
   ```bash
   npm start
   # or
   ng serve --proxy-config proxy.conf.json
   ```

---

## Development Workflow

- **Backend:**
  - Start: `node app.js` (from repo root)
  - Environment: `.env` file for config
- **Frontend:**
  - Start: `npm start` (from `frontend/`)
  - API requests are proxied to backend via `frontend/proxy.conf.json`
- **Hot reload:**
  - Angular CLI provides hot reload by default
- **Build:**
  - Frontend: `ng build` (output in `frontend/dist/`)
- **Environment Variables:**
  - Backend: `.env` file
  - Frontend: use Angular environment files if needed

---

## Testing Instructions

- **Frontend:**
  - Run all unit tests: `ng test` (in `frontend/`)
  - End-to-end tests: `ng e2e` (if configured)
  - Test files: `*.spec.ts` in `frontend/src/app/`
- **Backend:**
  - No automated tests by default. Add Jest or Mocha/Chai for API tests if needed.
- **Coverage:**
  - Frontend: `ng test --code-coverage`

---

## Code Style Guidelines

- **TypeScript:** Strict type checking, avoid `any`, prefer `unknown` if needed
- **Angular:**
  - Use standalone components (do not set `standalone: true` explicitly)
  - Use signals for state, `computed()` for derived state
  - Prefer `input()`/`output()` functions over decorators
  - Use `host` object for bindings, not `@HostBinding`/`@HostListener`
  - Use `NgOptimizedImage` for static images (not for base64)
  - Prefer inline templates for small components
  - Use `ChangeDetectionStrategy.OnPush`
  - Prefer reactive forms
  - Use `class`/`style` bindings, not `ngClass`/`ngStyle`
- **Services:** Single responsibility, `providedIn: 'root'`, use `inject()`
- **Linting/Formatting:**
  - Use Prettier (see `frontend/package.json` for config)
  - Run `ng lint` if configured
- **File Organization:**
  - Angular code in `frontend/src/app/`
  - Backend models in `models/`

---

## Build and Deployment

- **Frontend Build:**
  - `ng build` (output in `frontend/dist/`)
- **Backend:**
  - Serve with `node app.js`
- **Docker Compose:**
  - Start MongoDB: `docker compose -f mongodb.yaml up -d`
- **Environment Config:**
  - Backend: `.env` file
- **Deployment:**
  - Build frontend, serve static files from backend (`app.js` serves `frontend/dist`)

---

## Security Considerations

- **Authentication:** JWT-based, tokens stored in frontend
- **Secrets:** Store secrets (DB URI, JWT secret) in `.env`, never commit to VCS
- **Permissions:** All book CRUD endpoints are protected by JWT middleware

---

## Pull Request Guidelines

- Title format: `[component] Brief description`
- Required checks: Lint and test (if configured)
- Review: Ensure code style and conventions are followed (see `frontend/.github/copilot-instructions.md`)
- Commit messages: Clear, imperative, reference related issues if any

---

## Debugging and Troubleshooting

- **Common issues:**
  - MongoDB connection errors: check `.env` and MongoDB status
  - CORS issues: ensure frontend uses proxy config
  - JWT errors: check `JWT_SECRET` in `.env`
- **Logging:**
  - Backend: uses `console.log` for basic logging
- **Error handling:**
  - Backend: global error handler in `app.js`

---

## Additional Notes

- For full coding standards, see `frontend/.github/copilot-instructions.md`
- For agent workflow, see `.github/chatmodes/beast-mode.chatmode.md`
- Update this file as workflows or dependencies change
