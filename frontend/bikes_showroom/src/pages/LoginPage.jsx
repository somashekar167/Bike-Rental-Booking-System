import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const LOCAL_USERS_KEY = 'offlineAdminUsers';

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ error: null, success: null, loading: false });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ error: null, success: null, loading: true });

    try {
      if (isLogin) {
        // Login API Call
        const res = await axios.post('http://localhost:8080/api/auth/login', credentials);
        if (res.data.token) {
          localStorage.setItem('adminToken', res.data.token);
          navigate('/admin');
        }
      } else {
        // Register API Call
        const res = await axios.post('http://localhost:8080/api/auth/register', credentials);
        if (res.data.username) {
          setStatus({ error: null, success: 'Registration successful! You can now log in.', loading: false });
          setIsLogin(true); // Switch to login view
          setCredentials({ username: '', password: '' }); // Clear form
        }
      }
    } catch (err) {
      if (err.message === 'Network Error' || !err.response) {
        // Offline fallback: allow login only for users registered in local storage.
        if (isLogin) {
          const users = getLocalUsers();
          const matchedUser = users.find(
            (user) =>
              user.username === credentials.username && user.password === credentials.password
          );

          if (matchedUser) {
            localStorage.setItem('adminToken', `offline-token-${Date.now()}`);
            navigate('/admin');
          } else {
            setStatus({
              error: 'Invalid credentials. Please use registered credentials.',
              success: null,
              loading: false
            });
          }
        } else {
          const users = getLocalUsers();
          const alreadyExists = users.some(
            (user) => user.username === credentials.username
          );

          if (alreadyExists) {
            setStatus({
              error: 'Username already exists. Please log in.',
              success: null,
              loading: false
            });
            return;
          }

          const updatedUsers = [
            ...users,
            { username: credentials.username, password: credentials.password }
          ];
          localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updatedUsers));

          setStatus({
            error: null,
            success: 'Backend is offline. Account saved locally; you can now log in.',
            loading: false
          });
          setIsLogin(true);
          setCredentials({ username: '', password: '' });
        }
      } else {
        setStatus({ 
          error: err.response?.data?.error || (isLogin ? 'Login failed.' : 'Registration failed.'), 
          success: null, 
          loading: false 
        });
      }
    }
  };

  return (
    <div className="container py-16" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ 
            width: '100%', 
            maxWidth: '450px', 
            backgroundColor: 'var(--bg-primary)', 
            padding: '2.5rem', 
            borderRadius: 'var(--radius-xl)', 
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', backgroundColor: 'var(--accent-light)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', color: 'var(--accent-color)' }}>
              <Lock size={32} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {isLogin ? 'Admin Login' : 'Admin Register'}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? 'Sign in to manage inventory' : 'Create a new admin account'}
            </p>
          </div>

          {status.error && (
            <div style={{ backgroundColor: 'rgb(254 226 226 / 0.1)', color: 'var(--accent-color)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--accent-color)' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem' }}>{status.error}</span>
            </div>
          )}

          {status.success && (
            <div style={{ backgroundColor: 'rgb(16 185 129 / 0.1)', color: '#10b981', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #10b981' }}>
              <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem' }}>{status.success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="form-input" 
                  style={{ paddingLeft: '3rem' }}
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="password" 
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="form-input" 
                  style={{ paddingLeft: '3rem' }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.875rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}
              disabled={status.loading}
            >
              {status.loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}></span> 
                  {isLogin ? 'Authenticating...' : 'Registering...'}
                </span>
              ) : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setStatus({ error: null, success: null, loading: false });
                setCredentials({ username: '', password: '' });
              }}
              style={{ color: 'var(--accent-color)', fontWeight: '600', textDecoration: 'underline', padding: '0.25rem' }}
            >
              {isLogin ? 'Register Here' : 'Log In Here'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
