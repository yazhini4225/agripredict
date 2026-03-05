import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft, AlertCircle, Leaf, Droplets, Sun, TrendingUp, CheckCircle2 } from 'lucide-react';
import { getRecommendations } from '../services/api';

const ICON_MAP = {
  fertilizer: <Leaf size={16}/>,
  water:      <Droplets size={16}/>,
  nutrients:  <Leaf size={16}/>,
  moisture:   <Droplets size={16}/>,
  sun:        <Sun size={16}/>,
  ph:         <TrendingUp size={16}/>,
};

export default function Recommendations() {
  const nav = useNavigate();
  const [data, setData]       = useState(null);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = sessionStorage.getItem('inputParams');
    if (!p) { nav('/input'); return; }
    getRecommendations(JSON.parse(p))
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, [nav]);

  const toggle = id => setChecked(c => ({ ...c, [id]: !c[id] }));
  const completedCount = Object.values(checked).filter(Boolean).length;
  const total = data?.recommendations.length || 0;
  const pct   = total ? Math.round(completedCount / total * 100) : 0;

  if (loading) return <div className="loading-wrap"><div className="spinner"/><p>Generating recommendations…</p></div>;
  if (!data)   return null;

  return (
    <div>
      <nav className="nav">
        <a className="nav-logo" href="/"><Sprout size={22}/>AgriPredict – Recommendations</a>
        <button className="nav-back" onClick={() => nav('/dashboard')}><ArrowLeft size={15}/> Back to Dashboard</button>
      </nav>

      <div className="page">
        <h1 className="page-title">Actionable Recommendations</h1>
        <p className="page-subtitle">Follow these expert suggestions to improve your crop yield</p>

        {/* Progress */}
        <div className="card" style={{ marginTop:'1.75rem', marginBottom:'1rem' }}>
          <div className="impl-bar">
            <div>
              <div style={{fontWeight:600,fontSize:'0.95rem',color:'var(--green-900)'}}>Implementation Progress</div>
              <div style={{fontSize:'0.82rem',color:'var(--gray-600)',marginTop:2}}>{completedCount} of {total} recommendations completed</div>
            </div>
            <div className="impl-pct">{pct}%</div>
          </div>
          <div className="progress" style={{marginTop:'0.75rem'}}>
            <div className="progress-fill" style={{width:`${pct}%`}}/>
          </div>
        </div>

        {/* Summary stats */}
        <div className="stats-grid stats-grid-3" style={{ marginBottom:'1rem' }}>
          <div className="stat-card">
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div className="stat-label">High Priority</div>
              <AlertCircle size={18} color="#dc2626"/>
            </div>
            <div className="stat-value">{data.summary.high_priority}</div>
          </div>
          <div className="stat-card">
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div className="stat-label">Est. Yield Increase</div>
              <TrendingUp size={18} color="var(--green-600)"/>
            </div>
            <div className="stat-value" style={{color:'var(--green-700)'}}>{data.summary.total_est_yield_increase}</div>
          </div>
          <div className="stat-card">
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div className="stat-label">Completed</div>
              <CheckCircle2 size={18} color="var(--green-600)"/>
            </div>
            <div className="stat-value">{completedCount}</div>
          </div>
        </div>

        {/* Rec list */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.5rem' }}>
          {data.recommendations.map(rec => (
            <div className="rec-card" key={rec.id}>
              <input type="checkbox" className="rec-check" checked={!!checked[rec.id]} onChange={() => toggle(rec.id)}/>
              <div className={`rec-icon rec-icon-${rec.priority}`}>
                {ICON_MAP[rec.icon] || <Leaf size={16}/>}
              </div>
              <div className="rec-body">
                <h4>
                  {rec.title}
                  <span className={`badge badge-${rec.priority}`}>{rec.priority}</span>
                </h4>
                <p style={{ textDecoration: checked[rec.id] ? 'line-through' : 'none', opacity: checked[rec.id] ? 0.5 : 1 }}>
                  {rec.description}
                </p>
                <div className="rec-meta">
                  <span>↗ {rec.yield_potential} yield potential</span>
                  <span>Timeline: {rec.timeline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick action summary */}
        <div className="card" style={{marginBottom:'1.5rem'}}>
          <div className="section-title">Quick Action Summary</div>
          <div className="quick-actions">
            {[
              { label:'Immediate Actions (Next 2 weeks)', items: data.quick_actions.immediate },
              { label:'Short-term Actions (Next month)',  items: data.quick_actions.short_term },
              { label:'Long-term Planning (Next season)', items: data.quick_actions.long_term },
            ].map(qa => qa.items.length > 0 && (
              <div className="qa-item" key={qa.label}>
                <div className="qa-dot"><CheckCircle2 size={13}/></div>
                <div>
                  <div className="qa-label">{qa.label}</div>
                  <div className="qa-detail">{qa.items.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'flex',gap:'1rem'}}>
          <button className="btn btn-outline" onClick={() => nav('/input')}>Run New Prediction</button>
          <button className="btn btn-primary" onClick={() => nav('/optimization')}>Optimise Parameters</button>
        </div>
      </div>
    </div>
  );
}
