# MPMS Task Client

This repository contains the frontend for the MPMS Task application.
It is built with Next.js 16, React 19, Tailwind CSS, and shadcn/ui.
The client uses server actions, Zod validation, and cookie-based auth with a separate Express backend.

## Features

- Authentication and registration flows
- Team member management (add, edit, delete)
- Project, sprint, task, time log, and report management
- Zod validation for client-server payloads
- Reusable UI components with shadcn patterns
- API calls through a shared `serverFetch` helper

## Prerequisites

- Node.js 20 or newer
- npm, pnpm, or yarn
- Backend API running and reachable via `NEXT_PUBLIC_BASE_API`

## Setup

1. Install dependencies:

```bash
cd mpms-task-client
npm install
```

2. Create a `.env.local` file with the backend URL:

```bash
NEXT_PUBLIC_BASE_API=http://localhost:5000
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` - start the Next.js development server
- `npm run build` - build the production application
- `npm run start` - run the built production app
- `npm run lint` - run ESLint checks

## Environment Variables

- `NEXT_PUBLIC_BASE_API` - the backend API base URL for all client requests.

## Notes

- The frontend sends auth cookies to the backend via `serverFetch`.
- Team member forms are handled with `useActionState` and validated via Zod on the server.
- Remote images require the configured `next.config.ts` remote pattern.

## Recommended Workflow

- Run the backend first
- Then start the frontend
- Use the browser to verify login, team management, and project workflows
