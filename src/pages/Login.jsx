import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { Shield, ArrowRight } from 'lucide-react';
import API from '../api';
import '../styles/auth.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode(token);
        const role = payload.role || payload?.authorities || payload?.roles || payload?.roleName;
        setIsLoggedIn(true);
        setUserRole(role);
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login', form);
      const token = res.data.token ?? res.data?.accessToken;
      
      if (!token) throw new Error('No token received');
      
      localStorage.setItem('token', token);
      const payload = jwtDecode(token);
      const role = payload.role || payload?.authorities || payload?.roles || payload?.roleName;
      
      if (String(role ?? '').toUpperCase().includes('ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError('Invalid credentials. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-right" style={{ flex: 1, margin: 'auto' }}>
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <h3>Already Logged In</h3>
            <p>You are currently logged in. Where would you like to go?</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
              <motion.button
                className="btn-primary"
                onClick={() => navigate(String(userRole ?? '').toUpperCase().includes('ADMIN') ? '/admin' : '/user')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Dashboard
                <ArrowRight size={18} style={{ marginLeft: '0.5rem', display: 'inline' }} />
              </motion.button>
              
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsLoggedIn(false);
                  setUserRole(null);
                }}
                style={{
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '1px solid #e63946',
                  color: '#e63946',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Logout and Login as Different User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-left-content">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
            }}
          >
            <Shield size={40} />
          </motion.div>
          
            <h1>Welcome Back!</h1>
            <p>
              Sign in to access your secure banking dashboard and manage your finances with confidence.
            </p>
          
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png"
            alt="Banking"
            className="auth-illustration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          />
        </div>
      </motion.div>

      <motion.div 
        className="auth-right"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-card">
          <h3>Sign In</h3>
          <p>Enter your credentials to access your account</p>

          {error && (
            <motion.div
              className="alert alert-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="btn-primary"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight size={18} style={{ marginLeft: '0.5rem', display: 'inline' }} />
                </>
              )}
            </motion.button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <a href="/signup">Create Account</a>
            <br />
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}