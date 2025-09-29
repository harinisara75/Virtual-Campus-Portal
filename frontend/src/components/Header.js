// frontend/src/components/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ user, setUser }) {
  const location = useLocation();

  // hide nav/user block on login or register routes
  const hideFullHeader = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  const handleLogout = () => {
    // clear local auth and app state
    try {
      localStorage.removeItem('vc_token');
      localStorage.removeItem('vc_user');
    } catch (e) {}
    if (typeof setUser === 'function') setUser(null);
    // redirect to login page
    window.location.href = '/login';
  };

  return (
    <header className="app-header" style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px'}}>
      <div className="brand">
        <Link to="/" style={{textDecoration:'none', color:'inherit', fontWeight:700}}>Virtual Campus Portal</Link>
      </div>

      {/* show nav + user only when not on login/register/home */}
      {!hideFullHeader && (
        <nav style={{display:'flex', gap:12, alignItems:'center', padding:'4px 8px', borderRadius:6, background:'#f0f0f0'}}>
          {/* <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <Link to="/dashboard" style={{textDecoration:'none', color:'black'}} className="nav-link">Dashboard</Link>
            <Link to="/notices" style={{textDecoration:'none', color:'black'}} className="nav-link">Notices</Link>
            <Link to="/events" style={{textDecoration:'none', color:'black'}} className="nav-link">Events</Link>
            <Link to="/timetable" style={{textDecoration:'none', color:'black'}} className="nav-link">Timetable</Link>
            <Link to="/map" style={{textDecoration:'none', color:'black'}} className="nav-link">Map</Link>
          </div> */}

          <div style={{marginLeft:12, display:'flex', gap:8, alignItems:'center'}}>
            {user ? (
              <>
                <div style={{padding:'4px 8px', borderRadius:6, background:'#f0f0f0'}}>{user.name}</div>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
