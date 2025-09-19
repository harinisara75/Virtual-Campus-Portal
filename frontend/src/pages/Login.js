// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      // expected res.data: { token, name, role }
      const token = res.data.token;
      const name = res.data.name || res.data.user?.name;
      const role = res.data.role || res.data.user?.role;

      if (!token) {
        alert('Login failed: no token returned.');
        return;
      }

      localStorage.setItem('vc_token', token);
      const u = { name: name || 'User', role: role || 'student' };
      localStorage.setItem('vc_user', JSON.stringify(u));
      setUser && setUser(u);

      // redirect to dashboard
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login error', err.response || err.message);
      alert('Login failed: check email and password.');
    }
  };

  return (
    <div className='center'>
      <form onSubmit={submit} className='card' style={{ minWidth:320 }}>
        <h2>Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' type='password' required />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}
