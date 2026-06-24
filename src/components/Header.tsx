import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="app-header">
            <div className="header-logo">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                    <path d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z" stroke="white" strokeWidth="3" />
                </svg>
                <span>D&D Mobile</span>
            </div>
            <nav className="header-nav">
                <span className="nav-placeholder">Menu</span>
            </nav>
        </header>
    );
};

export default Header;