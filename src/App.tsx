import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CharacterContainer from './pages/CharacterContainer';
import SpellbookContainer from './pages/SpellbookContainer';
import CampaignContainer from './pages/CampaignContainer';

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <div className="app-container">
          {/* Нав меню */}
          <nav className="bottom-nav">
            <Link to="/">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/characters">Characters</Link>
            <Link to="/spellbook">Spellbook</Link>
            <Link to="/campaigns">Campaigns</Link>
          </nav>

          <div className="page-content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/characters" element={<CharacterContainer />} />
              <Route path="/spellbook" element={<SpellbookContainer />} />
              <Route path="/campaigns" element={<CampaignContainer />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
};

export default App;