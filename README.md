# TaskFlow — Task Management Application

A lightweight Jira/Trello-style task management app. **Core v1**: authentication, task CRUD, Kanban board, and an analytics dashboard. Built with the full MERN + TypeScript stack.

## Tech Stack
**Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn-style UI, React Router, TanStack Query, React Hook Form + Zod, Framer Motion, Zustand, Recharts, @hello-pangea/dnd (Kanban drag-and-drop)
**Backend:** Node.js, Express, TypeScript, MongoDB + Mongoose, JWT (access + refresh tokens), bcrypt, Socket.IO (wired up, ready for real-time features)

## What's in this v1 (core-first pass)
- Register / Login / Logout with JWT access + refresh tokens (refresh token in httpOnly cookie)
- Protected routes + role-based authorization (admin/user)
- Full Task CRUD: create, list (search/filter/sort/paginate), view, edit, delete
- Kanban board with drag-and-drop status updates, persisted to MongoDB
- Dashboard with stat cards + Pie/Line/Bar charts (Recharts) from live aggregated data
- Dark mode toggle (persisted)
- Responsive layout with collapsible sidebar
- Settings page (update profile, change password)
- Basic Admin panel (list users)

**Not yet built (planned for next passes):** comments UI, notifications/Socket.IO events, global search UI, custom categories management, file attachments, Docker, automated tests, forgot/reset password flow. Backend routes for comments and users already exist — only the frontend screens are pending.

## Getting Started

### 1. Backend
```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT secrets
npm install
npm run dev            # runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env   # set VITE_API_URL if different
npm install
npm run dev             # runs on http://localhost:5173
```

You'll need a MongoDB instance running (local `mongod` or a MongoDB Atlas connection string) for `MONGO_URI`.

### 3. Try it out
1. Go to `http://localhost:5173/register` and create an account.
2. Create a few tasks from the Tasks page.
3. Drag them between columns on the Kanban board.
4. Check the Dashboard for live charts.

## API Overview
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/refresh | Refresh access token |
| GET | /api/auth/me | Current user |
| GET | /api/tasks | List tasks (search/filter/sort/paginate) |
| GET | /api/tasks/stats | Dashboard aggregates |
| POST | /api/tasks | Create task |
| GET/PUT/DELETE | /api/tasks/:id | Read/update/delete task |
| POST | /api/comments | Add comment |
| GET | /api/comments/:taskId | Comments for a task |
| PUT/DELETE | /api/comments/:id | Edit/delete comment |
| GET | /api/users | List users (admin) |
| PUT | /api/users/profile | Update own profile |
| PUT | /api/users/change-password | Change password |
| DELETE | /api/users/:id | Delete user (admin only) |

## Project Structure
```
task-management-app/
  backend/src/{config,models,middleware,controllers,routes,utils,types}
  frontend/src/{components,pages,hooks,store,types,services,lib}
```
