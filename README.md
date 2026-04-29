# ticktock — Timesheet Management App

A SaaS-style timesheet management web application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Matches the provided Figma/screenshot designs pixel-closely.

---

## Live Demo

> Deploy to Vercel in one click:
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ticktock.git
cd ticktock

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and set NEXTAUTH_SECRET (any random string works for dev)

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Credentials

| Email               | Password     |
|---------------------|--------------|
| john@example.com    | password123  |
| jane@example.com    | password123  |

---

## Running Tests

```bash
npm test          # run all tests once
npm run test:watch # watch mode
```

---

## Project Structure

```
ticktock/
├── app/                        # Next.js App Router
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth catch-all route
│   │   └── timesheets/         # REST-style internal API
│   │       ├── route.ts        # GET (list, paginated + filtered)
│   │       └── [id]/
│   │           ├── route.ts             # GET single, PATCH
│   │           └── tasks/
│   │               ├── route.ts         # POST new task
│   │               └── [taskId]/route.ts # PATCH / DELETE task
│   ├── dashboard/
│   │   ├── layout.tsx          # Auth guard + Navbar shell
│   │   ├── page.tsx            # Timesheet list dashboard
│   │   └── [id]/page.tsx       # Weekly timesheet detail
│   ├── login/page.tsx          # Split-panel login page
│   ├── layout.tsx              # Root layout (SessionProvider)
│   ├── providers.tsx           # Client-side providers wrapper
│   └── page.tsx                # Root redirect → /dashboard or /login
│
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx       # Email/password form with validation
│   ├── layout/
│   │   └── Navbar.tsx          # Sticky top nav with sign-out menu
│   └── timesheet/
│       ├── TimesheetList.tsx   # Table, status filter, pagination
│       ├── TimesheetDetail.tsx # Weekly view with progress bar
│       ├── StatusBadge.tsx     # Coloured status chip (Completed/Incomplete/Missing)
│       ├── Pagination.tsx      # Page controls with ellipsis
│       ├── TaskRow.tsx         # Task row with Edit/Delete context menu
│       └── AddEntryModal.tsx   # Add/edit task modal with validation
│
├── lib/
│   ├── mock-data.ts            # Seed timesheets, dummy users, project/work-type lists
│   ├── timesheet-store.ts      # In-memory CRUD store (mock DB)
│   └── utils.ts                # getStatusStyles, getActionLabel, clamp, formatDate
│
├── types/index.ts              # All shared TypeScript interfaces & types
├── middleware.ts               # Edge middleware — protects /dashboard/* routes
│
└── __tests__/
    ├── LoginForm.test.tsx
    ├── Pagination.test.tsx
    ├── StatusBadge.test.tsx
    ├── AddEntryModal.test.tsx
    └── timesheetStore.test.ts
```

---

## Frameworks & Libraries

| Package | Purpose |
|---|---|
| `next` 14 | App Router, server components, API routes |
| `next-auth` v4 | Authentication (CredentialsProvider + JWT sessions) |
| `react` 18 | UI library |
| `typescript` 5 | Static typing throughout |
| `tailwindcss` 3 | Utility-first styling |
| `jest` + `@testing-library/react` | Unit & component tests |

No extra UI component libraries — all components are hand-built to match the designs precisely.

---

## Architecture Decisions

### All client fetches go through internal API routes
Every `fetch()` call from the browser targets `/api/timesheets/*`. This keeps third-party credentials server-side and makes it trivial to swap the in-memory store for a real database later.

### In-memory store as mock DB
`lib/timesheet-store.ts` is a singleton object that holds timesheet data in memory. It exposes the same interface a real DB adapter would (`getAll`, `getById`, `addTask`, `deleteTask`, `reset`), so swapping it for Prisma/Drizzle is a one-file change.

### Server Components for layout, Client Components for interactivity
- `app/dashboard/layout.tsx` — server component, reads session server-side, redirects if unauthenticated
- `TimesheetList`, `TimesheetDetail`, `AddEntryModal` — client components that own their own async state

### NextAuth middleware for edge-level protection
`middleware.ts` runs at the Vercel Edge and short-circuits unauthenticated requests to `/dashboard/*` before they hit any server component, preventing any flash of content.

### Form validation is inline (no schema library)
Kept intentionally simple. A production app could add `zod` + `react-hook-form` without changing the component structure.

---

## Assumptions

1. **Single user per session** — the timesheet list shows data for the logged-in user. In a real app, the store would be scoped by `userId` from the session.
2. **No persistence between server restarts** — the in-memory store resets when the Node.js process restarts. Replace with a DB to persist data.
3. **Week dates are derived from `startDate`/`endDate`** — the detail page generates the list of days from those fields rather than from stored task dates.
4. **Status is not auto-calculated** — status (`COMPLETED`, `INCOMPLETE`, `MISSING`) is stored as a field. A real system might derive it from hours logged vs expected.
5. **No role-based access** — all authenticated users see the same data. Production would add manager/employee roles.

---

## Time Spent

| Phase | Time |
|---|---|
| Planning & reading designs | 20 min |
| Project scaffold + auth | 45 min |
| API routes + store | 30 min |
| UI components (login, list, detail, modal) | 90 min |
| Tests | 30 min |
| README + polish | 15 min |
| **Total** | **~3.5 hrs** |
