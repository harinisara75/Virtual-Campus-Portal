// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // default student
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/auth/register', { name, email, password, role });
      alert('Registered! Now login.');
      navigate('/login');
    } catch (err) {
      console.error('Register error', err.response || err.message);
      alert('Register failed: ' + (err.response?.data?.msg || 'Check console'));
    }
  };

  return (
    <div className='center'>
      <form onSubmit={submit} className='card' style={{ minWidth:320 }}>
        <h2>Register</h2>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder='Full name' required />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' type='password' required />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value='student'>Student</option>
          <option value='teacher'>Teacher</option>
        </select>
        <button type='submit'>Register</button>
      </form>
    </div>
  );
}
