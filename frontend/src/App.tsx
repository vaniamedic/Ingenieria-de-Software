import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Footer from './components/common/Footer';
import Analytics from './pages/Analytics';
import './index.css';

type Page = 'dashboard' | 'analytics';

function App() {
  const [paginaActual, setPaginaActual] = useState<Page>('dashboard');

  return (
    <div className="App">
      {paginaActual === 'dashboard' && (
        <Dashboard onNavegar={setPaginaActual} />
      )}
      {paginaActual === 'analytics' && (
        <Analytics onNavegar={setPaginaActual} />
      )}
      
    </div>
  );
}

export default App;