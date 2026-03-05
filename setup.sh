#!/bin/bash
echo "========================================"
echo "  AgriPredict - Setup Script"
echo "========================================"

echo ""
echo "[1/3] Installing ML Service dependencies..."
cd ml-service && pip install -r requirements.txt && cd ..

echo ""
echo "[2/3] Installing Backend dependencies..."
cd backend && npm install && cd ..

echo ""
echo "[3/3] Installing Frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "========================================"
echo "  Setup complete!"
echo "  Open 3 terminals and run:"
echo "  Terminal 1: cd ml-service && python app.py"
echo "  Terminal 2: cd backend    && npm run dev"
echo "  Terminal 3: cd frontend   && npm start"
echo "========================================"
