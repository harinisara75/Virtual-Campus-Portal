// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notices from './pages/Notices';
import Events from './pages/Events';
import Timetable from './pages/Timetable';
import MapPage from './pages/MapPage';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [user, setUser] = useState(null);

  // On app load, read saved user from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vc_user');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.error('Error reading saved user', e);
    }
  }, []);

  return (
    <BrowserRouter>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/" element={<PrivateRoute user={user}><Dashboard user={user} /></PrivateRoute>} />
        <Route path="/notices" element={<PrivateRoute user={user}><Notices user={user} /></PrivateRoute>} />
        <Route path="/events" element={<PrivateRoute user={user}><Events user={user} /></PrivateRoute>} />
        <Route path="/timetable" element={<PrivateRoute user={user}><Timetable user={user} /></PrivateRoute>} />
        <Route path="/map" element={<PrivateRoute user={user}><MapPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute user={user}><Profile user={user} /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
