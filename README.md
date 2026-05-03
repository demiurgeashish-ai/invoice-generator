# Invoice Generator

A full-stack, multi-company invoice generator built with Node.js, Express, React, Vite, and Tailwind CSS.

## Features
- Multi-company architecture via Environment Variables.
- Custom theming, branding, and prefix rules.
- Authentication with Google OAuth & Local Email/Password.
- Create, Read, Update, and Delete Invoices.
- PDF generation and printing.

## Setup

### 1. Configure Company Identity
Edit `backend/.env` and fill in all `COMPANY_*` variables.
Optionally mirror key values in `frontend/.env` for fallback.

### 2. Backend
```bash
cd backend
cp .env.example .env   # fill in all values
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env   # fill in VITE_API_BASE_URL and VITE_GOOGLE_CLIENT_ID
npm install
npm run dev
```

### 4. Google OAuth
1. Go to https://console.cloud.google.com
2. Create a new project → Enable People API
3. Create OAuth 2.0 credentials (Web Application)
4. Add redirect URI: http://localhost:3000/auth/google/callback
5. Copy Client ID and Secret → backend/.env

### Switching Companies
To deploy for a different company, only change the `COMPANY_*` variables in `backend/.env`. No code changes required.
