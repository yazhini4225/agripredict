import axios from 'axios';

const ml = axios.create({ baseURL: 'http://localhost:8000', timeout: 30000 });

export const predictYield       = (data) => ml.post('/predict',         data).then(r => r.data);
export const optimizeYield      = (data) => ml.post('/optimize',        data).then(r => r.data);
export const getRecommendations = (data) => ml.post('/recommendations', data).then(r => r.data);

// Live commodity prices from World Bank (no API key needed)
export const getLivePrices = () =>
  ml.get('/prices').then(r => r.data).catch(() => ({ prices: {} }));

export const getCrops = () => Promise.resolve({
  crops:   ["Maize","Wheat","Rice","Soybean","Barley","Sunflower","Cotton","Sugarcane"],
  seasons: ["Spring","Summer","Autumn","Winter"],
});