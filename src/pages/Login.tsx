import React from 'react';
import './Login.css';

const Login: React.FC = () => {
    return (
        <div className="login-container">
            {/* Hero */}
            <div className="login-hero">
                <div className="hero-logo">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z" stroke="white" strokeWidth="3" />
                    </svg>
                </div>
                <h1 className="hero-title">Adventure Awaits</h1>
                <p className="hero-subtitle">Sign in to manage your characters & campaigns</p>
            </div>

            {/* Content */}
            <div className="login-content">
                <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <input type="email" placeholder="Email address" className="form-input" />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password" className="form-input" />
                    </div>
                    <div className="form-actions">
                        <a href="#" className="forgot-link">Forgot password?</a>
                    </div>
                    <button type="submit" className="signin-btn">Sign In</button>
                </form>

                <div className="divider">
                    <hr className="divider-line" />
                    <span className="divider-text">or</span>
                    <hr className="divider-line" />
                </div>

                <div className="social-login">
                    <button className="social-btn google">Google</button>
                    <button className="social-btn apple">Apple</button>
                </div>

                <div className="signup-section">
                    <span>Don't have an account? </span>
                    <a href="#" className="signup-link">Sign Up</a>
                </div>
            </div>
        </div>
    );
};

export default Login;