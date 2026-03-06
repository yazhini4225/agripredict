import axios from 'axios';

const ML_URL = 'https://agripredict-ml.onrender.com';

const ml = axios.create({ 
  baseURL: ML_URL, 
  timeout: 120000  // 2 minutes — enough for cold start
});

// Wake up the ML service before making requests
const wakeUp = async () => {
  try {
    await axios.get(`${ML_URL}/health`, { timeout: 90000 });
  } catch (e) {
    // ignore — just waking it up
  }
};

export const predictYield = async (data) => {
  await wakeUp();
  return ml.post('/predict', data).then(r => r.data);
};

export const optimizeYield = async (data) => {
  await wakeUp();
  return ml.post('/optimize', data).then(r => r.data);
};

export const getRecommendations = async (data) => {
  await wakeUp();
  return ml.post('/recommendations', data).then(r => r.data);
};

export const getLivePrices = () =>
  ml.get('/prices').then(r => r.data).catch(() => ({ prices: {} }));

export const getCrops = () => Promise.resolve({
  crops:   ["Maize","Wheat","Rice","Soybean","Barley","Sunflower","Cotton","Sugarcane"],
  seasons: ["Spring","Summer","Autumn","Winter"],
});