import React, { useState } from 'react';
import API from '../api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      
      // 👇 Debug log
      console.log('Response data:', res.data);

      localStorage.setItem('vc_token', res.data.token);
      const u = { name: res.data.name, role: res.data.role };
      localStorage.setItem('vc_user', JSON.stringify(u));
      setUser(u);
      window.location = '/';
    } catch (err) {
      alert('Login failed: check email/password');
    }
  };

  return (
    <div className='center'>
      <form onSubmit={submit} className='card' style={{ minWidth: 320 }}>
        <h2>Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' type='password' required />
        <button type='submit'>Login</button>
        <small className='muted'>Teacher accounts needed for create actions.</small>
      </form>
    </div>
  );
}
