# CollabAI - Project Roadmap

**Goal:** Secure Full-Stack Developer role with a production-ready SaaS portfolio project.

---

## Phase Status

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | ✅ Complete | Foundation & Docker |
| **Phase 2** | ✅ Complete | Auth & Database |
| Phase 3 | ⏳ Pending | Core CRUD & Redis Caching |
| Phase 4 | ⏳ Pending | Real-Time & Microservices |
| Phase 5 | ⏳ Pending | AI Integration |
| Phase 6 | ⏳ Pending | Polish & CI/CD |

---

## Phase 1: Foundation & Docker ✅

**Completed:**
- [x] Next.js 14 + TypeScript + Tailwind CSS
- [x] Docker Compose (MongoDB, Redis, Next.js app)
- [x] Multi-stage Dockerfile (optimized ~200MB image)
- [x] Git repository initialized

**Commit:** `Phase 1: Foundation - Next.js + Docker setup`

---

## Phase 2: Auth & Database ✅

**Completed:**
- [x] Install dependencies (next-auth, mongoose)
- [x] Create `.env` with MongoDB URI, NextAuth secret
- [x] Define User schema (email, password, name, timestamps)
- [x] Define Project schema (name, description, members, ownerId, status)
- [x] Create API route: `/api/auth/[...nextauth]` (NextAuth handler)
- [x] Create API route: `/api/auth/register` (user registration)
- [x] Create API route: `/api/projects` (GET, POST)
- [x] Sign-in page with credentials authentication
- [x] Register page with form validation
- [x] Dashboard page showing user's projects
- [x] Global header with auth state awareness
- [x] SessionProvider wrapper for client-side auth

**Commit:** `Phase 2: Auth & Database`

---

## Phase 3: Core CRUD & Redis Caching ✅

**Completed:**
- [x] Define Task schema (src/models/TaskModel.ts)
- [x] API routes: Tasks (create, read, update, delete) (src/app/api/tasks and src/app/api/tasks/[id])
- [x] Redis connection setup (src/lib/redis.ts)
- [x] Cache Dashboard stats (task counts, completion rate) (src/lib/cache.ts) with invalidation on task mutations
- [x] Rate limiting middleware (Redis-based) (src/lib/rateLimit.ts + src/middleware.ts)

**Commit:** `Phase 3: CRUD & Redis`

---

## Phase 4: Real-Time & Microservices

**Goals:**
- Socket.io for live updates
- Separate Worker Service for heavy tasks
- BullMQ queue for background jobs

**Tasks:**
- [ ] Socket.io server setup
- [ ] Real-time task updates (create/edit/delete)
- [ ] Create separate Node.js/Express Worker Service
- [ ] BullMQ queue setup (Redis-based)
- [ ] Move heavy computations to worker
- [ ] Commit: `Phase 4: Real-Time & Workers`

---

## Phase 5: AI Integration

**Goals:**
- OpenAI API integration via Worker Service
- "Summarize Project" feature

**Tasks:**
- [ ] OpenAI API key setup
- [ ] Worker service: AI task processor
- [ ] API route: `/api/projects/[id]/summarize`
- [ ] Store AI summaries in MongoDB
- [ ] Commit: `Phase 5: AI Integration`

---

## Phase 6: Polish & CI/CD

**Goals:**
- Unit tests (Vitest/Jest)
- GitHub Actions CI/CD
- Final README & deployment

**Tasks:**
- [ ] Write tests for API routes
- [ ] Write tests for critical components
- [ ] GitHub Actions workflow (test on PR)
- [ ] Deployment configuration
- [ ] Final README with features, setup, screenshots
- [ ] Commit: `Phase 6: Polish & CI/CD - Ready for Portfolio`

---

## Tech Stack Reference

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/UI |
| Backend | Next.js API Routes, Node.js/Express (Worker) |
| Database | MongoDB (Mongoose/Prisma) |
| Cache/Queue | Redis, BullMQ |
| Auth | NextAuth.js |
| AI | OpenAI API |
| DevOps | Docker, Docker Compose, GitHub Actions |

---

## Backlog (Post-Phase 6 Ideas)

- [ ] Dark mode toggle
- [ ] Email notifications
- [ ] File attachments
- [ ] Activity feed
- [ ] Export to PDF/CSV
- [ ] Mobile-responsive improvements

*Note: Backlog items are for after Phase 6. Do not implement during core phases unless explicitly approved.*
