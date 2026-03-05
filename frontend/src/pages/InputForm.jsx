import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft, DollarSign } from 'lucide-react';
import { predictYield, getLivePrices } from '../services/api';

const SLIDERS = [
  { key: 'rainfall',    label: 'Rainfall (mm)',            min: 200,  max: 1800, step: 10,  hint: 'Annual rainfall in millimetres' },
  { key: 'temperature', label: 'Temperature (°C)',          min: 8,    max: 42,   step: 0.5, hint: 'Average growing season temperature' },
  { key: 'nitrogen',    label: 'Nitrogen (N) kg/ha',        min: 10,   max: 160,  step: 1,   hint: '' },
  { key: 'phosphorus',  label: 'Phosphorus (P) kg/ha',      min: 5,    max: 120,  step: 1,   hint: '' },
  { key: 'potassium',   label: 'Potassium (K) kg/ha',       min: 10,   max: 140,  step: 1,   hint: '' },
  { key: 'soil_ph',     label: 'Soil pH',                   min: 4.5,  max: 8.5,  step: 0.1, hint: 'Soil acidity/alkalinity level' },
  { key: 'fertilizer',  label: 'Fertilizer Amount (kg/ha)', min: 40,   max: 400,  step: 5,   hint: 'Total fertilizer application' },
];

const CROPS   = ["Maize","Wheat","Rice","Soybean","Barley","Sunflower","Cotton","Sugarcane"];
const SEASONS = ["Spring","Summer","Autumn","Winter"];

function sliderPct(val, min, max) { return ((val - min) / (max - min)) * 100; }

export default function InputForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    crop: 'Maize', season: 'Autumn',
    rainfall: 650, temperature: 25, nitrogen: 50,
    phosphorus: 50, potassium: 50, soil_ph: 6.5, fertilizer: 175,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [price,   setPrice]   = useState(null);

  // Fetch live price when crop changes
  React.useEffect(() => {
    getLivePrices()
      .then(d => { if (d.prices?.[form.crop]) setPrice(d.prices[form.crop]); })
      .catch(() => {});
  }, [form.crop]);

  const handleSlider = (key, val) => setForm(f => ({ ...f, [key]: parseFloat(val) }));

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const result = await predictYield(form);
      sessionStorage.setItem('prediction',  JSON.stringify(result));
      sessionStorage.setItem('inputParams', JSON.stringify(form));
      nav('/dashboard');
    } catch (e) {
      setError('Prediction failed. Make sure ML service (port 8000) is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="nav">
        <a className="nav-logo" href="/"><Sprout size={22} />AgriPredict</a>
        <button className="nav-back" onClick={() => nav(-1)}><ArrowLeft size={15} /> Back</button>
      </nav>

      <div className="page" style={{ maxWidth: 720 }}>
        <h1 className="page-title">Input Crop Parameters</h1>
        <p className="page-subtitle">Enter the details about your crop and farming conditions</p>

        {/* Live price banner */}
        {price && (
          <div style={{ background:'var(--green-50)', border:'1.5px solid var(--green-200)', borderRadius:10, padding:'10px 16px', display:'flex', alignItems:'center', gap:8, marginTop:'1rem', fontSize:'0.88rem' }}>
            <DollarSign size={15} color="var(--green-700)" />
            <span>Live World Bank price for <strong>{form.crop}</strong>: <strong>${price}/ton</strong></span>
            <span style={{ color:'var(--gray-400)', marginLeft:'auto', fontSize:'0.78rem' }}>Revenue uses real market price</span>
          </div>
        )}

        <div className="card" style={{ marginTop:'1rem' }}>

          <div className="field">
            <label>Crop Type</label>
            <div className="select-wrap">
              <select value={form.crop} onChange={e => setForm(f => ({ ...f, crop: e.target.value }))}>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Season</label>
            <div className="select-wrap">
              <select value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value }))}>
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {SLIDERS.map(sl => (
            <div className="slider-wrap field" key={sl.key}>
              <div className="slider-label">
                <span>{sl.label}</span>
                <span style={{ color:'var(--green-700)', fontWeight:600 }}>{form[sl.key]}</span>
              </div>
              <input
                type="range" min={sl.min} max={sl.max} step={sl.step}
                value={form[sl.key]}
                style={{ '--val': sliderPct(form[sl.key], sl.min, sl.max) + '%' }}
                onChange={e => handleSlider(sl.key, e.target.value)}
              />
              {sl.hint && <div className="slider-hint">{sl.hint}</div>}
            </div>
          ))}

          {error && (
            <p style={{ color:'#dc2626', fontSize:'0.83rem', marginBottom:'1rem', background:'#fee2e2', padding:'10px 14px', borderRadius:8 }}>
              {error}
            </p>
          )}

          <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Predicting…' : 'Predict Yield'}
          </button>
        </div>

        <p style={{ fontSize:'0.78rem', color:'var(--gray-400)', marginTop:'0.75rem', textAlign:'center' }}>
          Model trained on FAOSTAT 2015–2024 · 8,621 records · 184 countries · Prices: World Bank
        </p>
      </div>
    </div>
  );
}