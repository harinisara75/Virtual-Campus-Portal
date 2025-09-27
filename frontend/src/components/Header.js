// src/components/Header.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../utils/api'; // adjust path if your axios instance is elsewhere

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    // remove from localStorage
    localStorage.removeItem('vc_token');
    localStorage.removeItem('vc_user');

    // clear axios header if exists
    try {
      delete API.defaults.headers.common['x-auth-token'];
    } catch (e) {
      console.warn('Failed to clear API header:', e);
    }

    // clear user state
    setUser(null);

    // let other parts of app know user updated
    window.dispatchEvent(new Event('vc:userUpdated'));

    // navigate to login
    navigate('/login');
  };

  // hide detailed nav on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return (
      <header className='header'>
        <a href='/' className='brand'>Virtual Campus</a>
      </header>
    );
  }

  return (
    <header className='header'>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <Link to='/' className='brand'>Virtual Campus</Link>
        {user && (
          <nav>
            <Link to='/dashboard' style={{ marginRight:12 }}>Dashboard</Link>
            <Link to='/notices' style={{ marginRight:12 }}>Notices</Link>
            <Link to='/events' style={{ marginRight:12 }}>Events</Link>
            <Link to='/timetable' style={{ marginRight:12 }}>Timetable</Link>
            <Link to='/map' style={{ marginRight:12 }}>Map</Link>
          </nav>
        )}
      </div>

      <div>
        { user ? (
          <>
            <span style={{ marginRight:12 }}>{user.name} • {user.role}</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link to='/login'>Login</Link>
        )}
      </div>
    </header>
  );
}
