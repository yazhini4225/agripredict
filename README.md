# 🌾 AgriPredict - Smart Crop Yield Optimization System

A full-stack agricultural prediction web app using React, Node.js/Express, and Python scikit-learn.

## Project Structure

```
agripredict/
├── frontend/          # React app (port 3000)
├── backend/           # Node.js/Express API (port 5000)
└── ml-service/        # Python FastAPI ML service (port 8000)
```

## Quick Start

### 1. ML Service (Python)
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

### 2. Backend (Node.js)
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000

## Pages
- `/` — Landing page
- `/input` — Crop parameter input form
- `/dashboard` — Prediction results dashboard
- `/analysis` — Factor impact analysis
- `/optimization` — What-if scenario simulation
- `/recommendations` — Actionable recommendations
