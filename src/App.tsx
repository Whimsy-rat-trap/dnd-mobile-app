import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CharacterContainer from './pages/CharacterContainer';
import SpellbookContainer from './pages/SpellbookContainer';
import CampaignContainer from './pages/CampaignContainer';
import Hub from './pages/Hub';
import Quest from './pages/Quest';
import Inventory from './pages/Inventory';
import ItemsLibrary from './pages/ItemsLibrary';
import SpellsLibrary from './pages/SpellsLibrary';
import CreateCharacter from './pages/CreateCharacter';
import { CharacterProvider } from './context/CharacterContext';
import { CampaignProvider } from './context/CampaignContext';

const App: React.FC = () => {
    return (
        <CharacterProvider>
            <CampaignProvider>
                <BrowserRouter>
                    <div className="app-container">
                        <div className="page-content">
                            <Routes>
                                <Route path="/" element={<Login />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/characters/new" element={<CreateCharacter />} />
                                <Route path="/characters/:id" element={<CharacterContainer />} />
                                <Route path="/spellbook" element={<SpellbookContainer />} />
                                <Route path="/campaigns" element={<CampaignContainer />} />
                                <Route path="/campaign/:id" element={<CampaignContainer />} />
                                <Route path="/hub" element={<Hub />} />
                                <Route path="/quests" element={<Quest />} />
                                <Route path="/inventory" element={<Inventory />} />
                                <Route path="/items" element={<ItemsLibrary />} />
                                <Route path="/spells" element={<SpellsLibrary />} />
                            </Routes>
                        </div>
                    </div>
                </BrowserRouter>
            </CampaignProvider>
        </CharacterProvider>
    );
};

export default App;