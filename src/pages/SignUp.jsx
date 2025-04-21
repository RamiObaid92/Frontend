// Signup.jsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [error, setError]             = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    try {
      const formData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        passwordConfirmation: confirm
      };

      console.log("Form data sent to signUp:", formData);
      
      await signUp(formData);
      navigate('/signin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={e => setFirstName(e.target.value)} 
            required />
        </div>
        <div>
          <label>Last Name</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={e => setLastName(e.target.value)} 
            required />
        </div>
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
          <label>Confirm Password</label>
          <input 
            type="password" 
            value={confirm} 
            onChange={e => setConfirm(e.target.value)} 
            required />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up…' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
