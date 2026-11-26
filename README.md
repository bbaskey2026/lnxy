# ExamPro Competitive Preparation Platform

A responsive React and Vite learning platform for competitive examination preparation.

## Technology

- React 19
- Material UI
- Redux Toolkit
- React Router
- Formik and Yup
- Recharts
- Axios
- Lucide React

## Run locally

```powershell
npm install
npm start
```

In a second terminal, start the backend with `AUTH_PERSISTENCE=memory` in `backend/.env`:

```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and proxies `/api` requests to the backend at `http://localhost:4000`.

## Validate and build

```powershell
npm run lint
npm run build
npm run preview
```

## Environment

The frontend defaults to the same-origin API path:

```text
VITE_API_BASE_URL=/api/v1
VITE_DEFAULT_LECTURE_VIDEO_SOURCE=
```

Set `VITE_API_BASE_URL` to an absolute API URL when the backend is hosted separately. The frontend uses the backend's register, login, refresh, and logout endpoints; the auth service also exposes `/auth/me` for profile retrieval. Refresh tokens are held in an HTTP-only cookie; access tokens remain in memory and are refreshed automatically after an API `401`.

## In-memory demo login

- Student email: `aarav@example.com`
- Password: `student123`

The backend's in-memory mode seeds this student account and resets its data when the backend stops.
