import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft, Info } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#1e4d2b','#3a7d52','#6aaf80','#a0cfb0','#c8e8d0'];

export default function Analysis() {
  const nav = useNavigate();
  const [fi, setFi]     = useState(null);
  const [params, setP]  = useState(null);

  useEffect(() => {
    const pred = sessionStorage.getItem('prediction');
    const p    = sessionStorage.getItem('inputParams');
    if (!pred) { nav('/input'); return; }
    const d = JSON.parse(pred);
    setFi(d.feature_importance);
    setP(p ? JSON.parse(p) : {});
  }, [nav]);

  if (!fi) return <div className="loading-wrap"><div className="spinner"/></div>;

  const barData = Object.entries(fi)
    .sort((a,b) => b[1]-a[1])
    .map(([name, value]) => ({ name, value }));

  const pieData = barData.map(d => ({ name: d.name, value: d.value }));

  const insights = [
    { key: 'Rainfall',       msg: `Rainfall has the highest impact at ${fi['Rainfall']}%. Your current level (${params?.rainfall}mm) is ${params?.rainfall < 700 ? 'below' : 'above'} optimal.` },
    { key: 'Soil Nutrients', msg: `NPK levels contribute ${fi['Soil Nutrients']}% to yield. Balance your N:${params?.nitrogen}, P:${params?.phosphorus}, K:${params?.potassium} ratio.` },
    { key: 'Fertilizer',     msg: `Fertilizer accounts for ${fi['Fertilizer']}% of yield. Current ${params?.fertilizer}kg/ha can be ${params?.fertilizer < 200 ? 'increased' : 'optimised'}.` },
  ];

  return (
    <div>
      <nav className="nav">
        <a className="nav-logo" href="/"><Sprout size={22}/>AgriPredict – Factor Impact Analysis</a>
        <button className="nav-back" onClick={() => nav('/dashboard')}><ArrowLeft size={15}/> Back to Dashboard</button>
      </nav>

      <div className="page">
        <h1 className="page-title">Feature Importance Analysis</h1>
        <p className="page-subtitle">Understanding which factors have the greatest impact on your crop yield</p>

        {/* Horizontal bar chart */}
        <div className="card" style={{ marginTop: '1.75rem', marginBottom: '1rem' }}>
          <div className="section-title">Factor Impact on Yield</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
              <XAxis type="number" domain={[0,35]} tick={{fontSize:11}} label={{ value:'Importance (%)', position:'insideBottom', offset:-4, fontSize:11 }}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:12}}/>
              <Tooltip formatter={v=>[`${v}%`,'Importance']}/>
              <Bar dataKey="value" fill="#1e4d2b" radius={[0,6,6,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie + breakdown */}
        <div className="two-col" style={{ marginBottom: '1rem' }}>
          <div className="card">
            <div className="section-title">Impact Distribution</div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name,value})=>`${name}: ${value}%`} labelLine={false}>
                  {pieData.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={v=>[`${v}%`]}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="section-title">Factor Breakdown</div>
            {barData.map((f,i) => (
              <div className="factor-item" key={f.name}>
                <div className="factor-row">
                  <span>{f.name}</span>
                  <span className="factor-pct"><Info size={13} style={{marginRight:4}}/>{f.value}% contribution to yield</span>
                </div>
                <div className="progress">
                  <div className="progress-fill" style={{ width:`${f.value / 0.35}%`, background: COLORS[i % COLORS.length] }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insight cards */}
        <div className="stats-grid stats-grid-3">
          {insights.map(ins => (
            <div className="card card-sm" key={ins.key}>
              <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                <div style={{ width:28,height:28,borderRadius:'50%',background:'var(--green-100)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <Info size={14} color="var(--green-700)"/>
                </div>
                <div>
                  <div style={{fontWeight:600,fontSize:'0.88rem',color:'var(--green-900)',marginBottom:4}}>{ins.key} Impact</div>
                  <div style={{fontSize:'0.8rem',color:'var(--gray-600)',lineHeight:1.5}}>{ins.msg}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:'1rem', marginTop:'2rem' }}>
          <button className="btn btn-primary" onClick={() => nav('/optimization')}>Optimise Parameters</button>
          <button className="btn btn-outline" onClick={() => nav('/recommendations')}>View Recommendations</button>
        </div>
      </div>
    </div>
  );
}
