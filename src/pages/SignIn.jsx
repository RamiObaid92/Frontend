import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const { signIn, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [rememberMe, setRemember] = useState(false);
  const [error, setError]         = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await signIn({ email, password, rememberMe });
      navigate('/projects');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isAuthenticated) {
    navigate('/projects');
    return null;
  }

  return (
    <div className="container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required />
        </div>
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={e => setRemember(e.target.checked)} />
            Remember Me
          </label>
        </div>
        {error && <p className="error">{error}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
  
        {/* 👇 Lägg till detta */}
        <p style={{ marginTop: "1rem" }}>
          Don't have an account? <Link to="/auth/signup">Sign up here</Link>
        </p>
      </form>
    </div>
  );
}
