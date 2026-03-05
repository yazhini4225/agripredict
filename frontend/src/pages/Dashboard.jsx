import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft, TrendingUp, Target, BarChart2, FileText, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function Dashboard() {
  const nav = useNavigate();
  const [pred, setPred]     = useState(null);
  const [params, setParams] = useState(null);

  useEffect(() => {
    const p = sessionStorage.getItem('prediction');
    const q = sessionStorage.getItem('inputParams');
    if (!p) { nav('/input'); return; }
    setPred(JSON.parse(p));
    setParams(q ? JSON.parse(q) : {});
  }, [nav]);

  if (!pred) return <div className="loading-wrap"><div className="spinner" /><p>Loading…</p></div>;

  const chartData = [
    { name: 'Previous Season', yield: pred.prev_season_yield },
    { name: 'Your Prediction', yield: pred.predicted_yield },
    { name: 'FAO Global Avg',  yield: pred.fao_average },
    { name: 'Regional Avg',    yield: pred.regional_average },
  ];

  return (
    <div>
      <nav className="nav">
        <a className="nav-logo" href="/"><Sprout size={22} />AgriPredict – Prediction Dashboard</a>
        <button className="nav-back" onClick={() => nav(-1)}><ArrowLeft size={15} /> Back</button>
      </nav>

      <div className="page">
        {/* Data source badge */}
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.78rem', color:'var(--green-700)', background:'var(--green-50)', padding:'6px 12px', borderRadius:8, marginBottom:'1rem', width:'fit-content' }}>
          <Globe size={13} /> {pred.data_source || 'FAOSTAT 2015-2024'}
          {pred.price_source && <span style={{ marginLeft:8, color:'var(--gray-500)' }}>· Prices: {pred.price_source}</span>}
        </div>

        {/* Main yield card */}
        <div className="card" style={{ marginBottom:'1rem' }}>
          <div className="yield-hero">
            <div>
              <div style={{ fontSize:'0.85rem', color:'var(--gray-600)', marginBottom:4 }}>Predicted Crop Yield</div>
              <div className="yield-num">{pred.predicted_yield}</div>
              <div className="yield-unit">tons per hectare</div>
              <div className="yield-meta">
                Crop: <span>{params?.crop}</span> &nbsp;|&nbsp; Season: <span>{params?.season}</span>
              </div>
              {pred.fao_average && (
                <div style={{ fontSize:'0.8rem', color:'var(--gray-500)', marginTop:4 }}>
                  FAO global average: {pred.fao_average} t/ha &nbsp;·&nbsp;
                  <span style={{ color: pred.predicted_yield >= pred.fao_average ? 'var(--green-700)' : '#dc2626', fontWeight:600 }}>
                    {pred.predicted_yield >= pred.fao_average ? '▲ Above' : '▼ Below'} global average
                  </span>
                </div>
              )}
            </div>
            <div className="yield-icon"><TrendingUp size={30} /></div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid stats-grid-3" style={{ marginBottom:'1rem' }}>
          <div className="stat-card">
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div className="stat-label">Confidence Level</div>
              <BarChart2 size={18} color="var(--green-600)" />
            </div>
            <div className="stat-value">{pred.confidence}%</div>
            <div className="stat-sub">Model accuracy score</div>
          </div>
          <div className="stat-card">
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div className="stat-label">Expected Revenue</div>
              <Target size={18} color="var(--green-600)" />
            </div>
            <div className="stat-value">${pred.expected_revenue?.toLocaleString()}</div>
            <div className="stat-sub">@ ${pred.price_per_ton}/ton {pred.price_source === 'World Bank (live)' ? '(live price)' : ''}</div>
          </div>
          <div className="stat-card">
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div className="stat-label">Improvement Potential</div>
              <TrendingUp size={18} color="var(--green-600)" />
            </div>
            <div className="stat-value" style={{ color: pred.improvement_potential > 0 ? 'var(--green-700)' : '#dc2626' }}>
              {pred.improvement_potential > 0 ? '+' : ''}{pred.improvement_potential}%
            </div>
            <div className="stat-sub">Vs. previous season</div>
          </div>
        </div>

        {/* Chart with FAO reference line */}
        <div className="card" style={{ marginBottom:'1rem' }}>
          <div className="section-title">Yield Comparison vs FAO Benchmarks</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top:10, right:10, left:-10, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} label={{ value:'Yield (t/ha)', angle:-90, position:'insideLeft', offset:15, fontSize:11 }} />
              <Tooltip formatter={v => [`${v} t/ha`, 'Yield']} />
              <Bar dataKey="yield" radius={[6,6,0,0]}
                fill="#1e4d2b"
                label={{ position:'top', fontSize:11, fill:'#1e4d2b', formatter: v => `${v}` }}
              />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize:'0.75rem', color:'var(--gray-400)', marginTop:8 }}>
            FAO benchmarks sourced from FAOSTAT 2015-2024 global averages
          </div>
        </div>

        {/* Nav cards */}
        <div className="nav-cards">
          {[
            { icon: <BarChart2 size={22}/>, title:'Factor Analysis',   desc:'See which factors impact yield most',       path:'/analysis',        cta:'View Analysis' },
            { icon: <Target size={22}/>,    title:'What-If Scenarios', desc:'Simulate conditions and optimise yield',    path:'/optimization',    cta:'Run Simulation' },
            { icon: <FileText size={22}/>,  title:'Recommendations',   desc:'Actionable insights to improve your yield', path:'/recommendations', cta:'View Tips' },
          ].map(n => (
            <div className="nav-card" key={n.title} onClick={() => nav(n.path)}>
              <div className="nav-card-icon">{n.icon}</div>
              <h3>{n.title}</h3>
              <p>{n.desc}</p>
              <div className="nav-card-link">{n.cta} →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}