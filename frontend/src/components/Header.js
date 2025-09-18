import React from 'react';

export default function Header({ user, setUser }){
  const logout = ()=>{ localStorage.removeItem('vc_token'); localStorage.removeItem('vc_user'); setUser(null); window.location='/login'; }
  return (
    <header className='header'>
      <a href='/' className='brand'>Virtual Campus</a>
      <nav>
        { user ? (
          <>
            <a href='/'>Dashboard</a>
            <a href='/notices'>Notices</a>
            <a href='/events'>Events</a>
            <a href='/timetable'>Timetable</a>
            <a href='/map'>Map</a>
            <a href='/profile'>Profile</a>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <a href='/login'>Login</a>
        )}
      </nav>
    </header>
  );
}
