import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing        from './pages/Landing';
import InputForm      from './pages/InputForm';
import Dashboard      from './pages/Dashboard';
import Analysis       from './pages/Analysis';
import Optimization   from './pages/Optimization';
import Recommendations from './pages/Recommendations';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<Landing />} />
        <Route path="/input"          element={<InputForm />} />
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/analysis"       element={<Analysis />} />
        <Route path="/optimization"   element={<Optimization />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </BrowserRouter>
  );
}
