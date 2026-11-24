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
npm run dev
```

The development server runs at `http://127.0.0.1:3000`.

## Validate and build

```powershell
npm run lint
npm run build
npm run preview
```

## Environment

Update `.env` with platform configuration:

```text
VITE_API_BASE_URL=/api
VITE_DEFAULT_LECTURE_VIDEO_SOURCE=
```

The current experience uses mock in-browser data. Authentication is simulated and must be replaced by a secure real API before production deployment.

## Demo roles

- Student: use an email such as `aarav@example.com`
- Admin: use an email containing `admin`, such as `admin@exampro.com`
- Password: at least six characters
