# Setup Guide

## Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB 7+ (local or Docker)
- Firebase project (for authentication)

## Quick Start

### 1. Clone and install dependencies

```bash
# Frontend
cd apps/web
npm install

# Backend
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure environment

```bash
# Copy example env
cp .env.example apps/api/.env

# Create frontend env
cat > apps/web/.env.local << EOF
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000:web:000
EOF
```

### 3. Start MongoDB

```bash
# Via Docker
docker run -d -p 27017:27017 --name zenovra-mongo mongo:7

# Or use Docker Compose
docker-compose up mongodb
```

### 4. Start the application

```bash
# Terminal 1 — Backend
cd apps/api
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd apps/web
npm run dev
```

### 5. Open the app

Navigate to http://localhost:3000

The app runs in demo mode by default — no Firebase credentials needed for development. The backend returns a demo user when `DEBUG=true`.

## Docker Compose (Full Stack)

```bash
docker-compose up --build
```

Access the app at http://localhost

## Firebase Setup (Production)

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Email/Password authentication
3. Download the service account key JSON
4. Set `FIREBASE_CREDENTIALS_PATH` to the JSON file path
5. Configure the frontend env vars with your Firebase config
