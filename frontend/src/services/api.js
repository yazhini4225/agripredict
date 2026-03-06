import axios from 'axios';

const ml = axios.create({ 
  baseURL: 'https://agripredict-ml.onrender.com', 
  timeout: 60000  
});

export const predictYield       = (data) => ml.post('/predict',         data).then(r => r.data);
export const optimizeYield      = (data) => ml.post('/optimize',        data).then(r => r.data);
export const getRecommendations = (data) => ml.post('/recommendations', data).then(r => r.data);
export const getLivePrices      = ()     => ml.get('/prices').then(r => r.data).catch(() => ({ prices: {} }));

export const getCrops = () => Promise.resolve({
  crops:   ["Maize","Wheat","Rice","Soybean","Barley","Sunflower","Cotton","Sugarcane"],
  seasons: ["Spring","Summer","Autumn","Winter"],
});