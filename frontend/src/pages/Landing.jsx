import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Leaf, Target, Lightbulb, Sprout } from 'lucide-react';

export default function Landing() {
  const nav = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <nav className="nav">
        <a className="nav-logo" href="/">
          <Sprout size={22} />
          AgriPredict
        </a>
      </nav>

      {/* Hero */}
      <div className="hero">
        <h1>Smart Crop Yield Optimization System</h1>
        <p>
          Harness the power of machine learning to predict crop yields, analyze contributing
          factors, and optimize your farming decisions for maximum productivity.
        </p>
        <button className="hero-btn" onClick={() => nav('/input')}>
          <Sprout size={18} /> Start Prediction
        </button>
      </div>

      {/* Feature cards */}
      <div style={{ background: '#fff', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="feature-grid">
            {[
              { icon: <TrendingUp size={22}/>, title: 'ML-Based Prediction', desc: 'Advanced algorithms analyze multiple parameters to accurately predict crop yields' },
              { icon: <Leaf size={22}/>,       title: 'Factor Analysis',     desc: 'Understand the impact of rainfall, soil nutrients, and other factors on your yield' },
              { icon: <Target size={22}/>,     title: 'What-If Scenarios',   desc: 'Simulate different conditions to find the optimal farming strategy' },
              { icon: <Lightbulb size={22}/>,  title: 'Smart Recommendations', desc: 'Get actionable insights to improve fertilization, irrigation, and timing' },
            ].map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: '#f5f7f5', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, color: 'var(--green-900)', marginBottom: '2.5rem' }}>
            How It Works
          </h2>
          <div className="steps">
            {[
              { n: 1, title: 'Input Parameters',  desc: 'Enter crop type, soil data, weather conditions, and fertilizer usage' },
              { n: 2, title: 'AI Analysis',        desc: 'Our ML model processes your data and generates predictions' },
              { n: 3, title: 'Optimize & Act',     desc: 'Review insights, run scenarios, and implement recommendations' },
            ].map(s => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button className="btn btn-primary" onClick={() => nav('/input')}>Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
}
