import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft, Settings2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { optimizeYield } from '../services/api';

function sliderPct(val, min, max) { return ((val-min)/(max-min))*100; }

export default function Optimization() {
  const nav = useNavigate();
  const [params, setParams]   = useState(null);
  const [fertilizer, setFert] = useState(175);
  const [irrigation, setIrr]  = useState(70);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const p = sessionStorage.getItem('inputParams');
    if (!p) { nav('/input'); return; }
    const parsed = JSON.parse(p);
    setParams(parsed);
    setFert(parsed.fertilizer || 175);
  }, [nav]);

  const runOptimization = useCallback(async (fert, irr) => {
    if (!params) return;
    setLoading(true);
    try {
      const res = await optimizeYield({ ...params, fertilizer: fert, irrigation: irr });
      setResult(res);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [params]);

  useEffect(() => {
    if (params) runOptimization(fertilizer, irrigation);
  }, [params]); // eslint-disable-line

  const projData = result?.yield_projection.months.map((m,i) => ({
    month: m,
    current: result.yield_projection.current[i],
    optimal: result.yield_projection.optimal[i],
  })) || [];

  const maxScenario = result?.scenarios ? Math.max(...result.scenarios.map(s=>s.yield)) : 1;

  return (
    <div>
      <nav className="nav">
        <a className="nav-logo" href="/"><Sprout size={22}/>AgriPredict – What-If Optimization</a>
        <button className="nav-back" onClick={() => nav('/dashboard')}><ArrowLeft size={15}/> Back to Dashboard</button>
      </nav>

      <div className="page">
        <h1 className="page-title">Scenario Simulation &amp; Optimization</h1>
        <p className="page-subtitle">Adjust parameters to see how different conditions affect your crop yield</p>

        <div className="two-col" style={{ marginTop: '1.75rem' }}>
          {/* Left: controls */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="card">
              <div className="section-title">Adjust Parameters</div>

              <div className="slider-wrap">
                <div className="slider-label">
                  <span>Fertilizer (kg/ha)</span>
                  <span style={{color:'var(--green-700)',fontWeight:600}}>{fertilizer}</span>
                </div>
                <input type="range" min={50} max={350} step={5} value={fertilizer}
                  style={{'--val':`${sliderPct(fertilizer,50,350)}%`}}
                  onChange={e => { setFert(+e.target.value); runOptimization(+e.target.value, irrigation); }}/>
                <div className="slider-hint">Original: {params?.fertilizer} kg/ha</div>
              </div>

              <div className="slider-wrap" style={{marginTop:'1.25rem'}}>
                <div className="slider-label">
                  <span>Irrigation Level (%)</span>
                  <span style={{color:'var(--green-700)',fontWeight:600}}>{irrigation}</span>
                </div>
                <input type="range" min={20} max={100} step={5} value={irrigation}
                  style={{'--val':`${sliderPct(irrigation,20,100)}%`}}
                  onChange={e => { setIrr(+e.target.value); runOptimization(fertilizer, +e.target.value); }}/>
                <div className="slider-hint">Percentage of optimal water requirement</div>
              </div>

              {result && (
                <>
                  <div style={{marginTop:'1.5rem'}}>
                    <div style={{fontSize:'0.8rem',color:'var(--gray-600)'}}>Predicted Yield</div>
                    <div style={{fontSize:'2.25rem',fontWeight:700,color:'var(--green-800)',lineHeight:1.1}}>{result.current_yield}</div>
                    <div style={{fontSize:'0.85rem',color:'var(--gray-500)'}}>tons per hectare</div>
                  </div>

                  <div className="optimal-box" style={{marginTop:'1.25rem'}}>
                    <div className="label"><Settings2 size={14}/> Optimal Configuration</div>
                    <div style={{fontSize:'0.82rem',color:'var(--gray-600)',marginBottom:4}}>
                      Fertilizer: {result.optimal_fertilizer} kg/ha, Irrigation: {result.optimal_irrigation}%
                    </div>
                    <div className="val">{result.optimal_yield} t/ha</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: charts */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="card">
              <div className="section-title">Yield Projection Over Time</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={projData} margin={{top:5,right:10,left:-10,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                  <XAxis dataKey="month" label={{value:'Month',position:'insideBottom',offset:-2,fontSize:11}}/>
                  <YAxis tick={{fontSize:11}} domain={['auto','auto']}/>
                  <Tooltip formatter={v=>[`${v} t/ha`]}/>
                  <Legend wrapperStyle={{fontSize:12}}/>
                  <Line type="monotone" dataKey="current" stroke="#6aaf80" dot={{r:3}} name="Current Settings" strokeWidth={2}/>
                  <Line type="monotone" dataKey="optimal" stroke="#1e4d2b" dot={{r:3}} name="Optimal Settings" strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </div>

            {result?.scenarios && (
              <div className="card">
                <div className="section-title">Scenario Comparison</div>
                {result.scenarios.map(s => (
                  <div className="scenario-row" key={s.label}>
                    <div className="scenario-row-header">
                      <span>{s.label}{s.yield === result.optimal_yield ? ' ✦' : ''}</span>
                      <span><strong>{s.yield} t/ha</strong> <span className="scenario-detail">{s.fertilizer} kg/ha fertilizer</span></span>
                    </div>
                    <div className="progress">
                      <div className="progress-fill" style={{width:`${(s.yield/maxScenario)*100}%`}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result && (
              <div className="card">
                <div className="section-title">Recommended Configuration</div>
                <div className="rec-config-grid">
                  {[
                    { label:'Fertilizer Application', val:`${result.optimal_fertilizer} kg/ha`, sub:'Split into 3 applications' },
                    { label:'Irrigation Schedule',    val:`${result.optimal_irrigation}% capacity`, sub:'Every 5-7 days' },
                    { label:'Expected Yield',         val:`${result.optimal_yield} t/ha`, sub:`+${result.roi_estimate}% improvement` },
                    { label:'ROI Estimate',           val:`+${result.roi_estimate}%`,    sub:'Revenue increase' },
                  ].map(r => (
                    <div className="rc-item" key={r.label}>
                      <div className="rc-label">{r.label}</div>
                      <div className="rc-val">{r.val}</div>
                      <div className="rc-sub">{r.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{display:'flex',gap:'1rem',marginTop:'1.5rem'}}>
          <button className="btn btn-primary" onClick={() => nav('/recommendations')}>View Detailed Recommendations</button>
          <button className="btn btn-outline" onClick={() => nav('/analysis')}>Back to Analysis</button>
        </div>
      </div>
    </div>
  );
}
