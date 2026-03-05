require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const axios   = require("axios");

const app = express();
const ML  = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

app.use(cors());
app.use(express.json());

const ml = axios.create({ baseURL: ML, timeout: 30000 });

app.get("/api/health", async (req, res) => {
  try { await ml.get("/health"); res.json({ status: "ok", ml: "connected" }); }
  catch { res.json({ status: "ok", ml: "disconnected" }); }
});

app.post("/api/predict",         async (req, res) => { try { res.json((await ml.post("/predict", req.body)).data); } catch(e) { res.status(500).json({ error: e.message }); } });
app.post("/api/optimize",        async (req, res) => { try { res.json((await ml.post("/optimize", req.body)).data); } catch(e) { res.status(500).json({ error: e.message }); } });
app.post("/api/recommendations", async (req, res) => { try { res.json((await ml.post("/recommendations", req.body)).data); } catch(e) { res.status(500).json({ error: e.message }); } });

// Live weather proxy (pass city param)
app.get("/api/weather", async (req, res) => {
  try { res.json((await ml.get(`/weather?city=${req.query.city}`)).data); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/crops", (req, res) => {
  res.json({
    crops:   ["Maize","Wheat","Rice","Soybean","Barley","Sunflower","Cotton","Sugarcane"],
    seasons: ["Spring","Summer","Autumn","Winter"],
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));