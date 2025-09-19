// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('vc_token');
    localStorage.removeItem('vc_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <Link to="/" className="brand">Virtual Campus</Link>
        <nav style={{ display:'flex', gap:12 }}>
          <Link to="/">Dashboard</Link>
          <Link to="/notices">Notices</Link>
          <Link to="/events">Events</Link>
          <Link to="/timetable">Timetable</Link>
          <Link to="/map">Map</Link>
        </nav>
      </div>

      <div>
        {user ? (
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ padding:'6px 10px', background:'#eef6ff', borderRadius:8 }}>
              {user.name} • <small style={{ opacity:.7 }}>{user.role}</small>
            </div>
            <button onClick={logout} style={{ padding:'6px 10px', borderRadius:6 }}>Logout</button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
