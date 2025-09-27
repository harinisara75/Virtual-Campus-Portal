// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

// inside src/pages/Login.js (submit handler)
const submit = async e => {
  e.preventDefault();
  try {
    const res = await API.post('/api/auth/login', { email, password });
    const token = res.data.token;
    if (!token) { alert('Login failed: no token'); return; }

    // set axios header and store token
    API.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('vc_token', token);

    // fetch fresh user from server and save
    const me = await API.get('/api/auth/me');
    localStorage.setItem('vc_user', JSON.stringify(me.data));
    setUser(me.data);

    // notify other pages and navigate to dashboard
    window.dispatchEvent(new Event('vc:userUpdated'));
    navigate('/dashboard', { replace: true });
  } catch (err) {
    console.error('Login error', err);
    alert('Login failed: check email/password');
  }
};


  return (
    <div className='center'>
      <form onSubmit={submit} className='card' style={{ minWidth:320 }}>
        <h2>Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' type='password' required />
        <a href="/register">Register</a>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}
