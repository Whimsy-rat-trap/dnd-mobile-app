import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CharacterContainer from './pages/CharacterContainer';
import SpellbookContainer from './pages/SpellbookContainer';
import CampaignContainer from './pages/CampaignContainer';

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <div className="app-container">
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