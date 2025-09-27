// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notices from './pages/Notices';
import Events from './pages/Events';
import Timetable from './pages/Timetable';
import MapPage from './pages/MapPage';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Attendees from './pages/Attendees';
import API from './api';   // ✅ import API

// load saved user synchronously
function getSavedUser() {
  try {
    const raw = localStorage.getItem('vc_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

export default function App() {
  const [user, setUser] = useState(() => getSavedUser());

  useEffect(() => {
    const token = localStorage.getItem('vc_token');
    if (token) {
      API.defaults.headers.common['x-auth-token'] = token; // ✅ send token automatically
    }

    if (user) {
      localStorage.setItem('vc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vc_user');
      localStorage.removeItem('vc_token');
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Header user={user} setUser={setUser} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected (dashboard is at /dashboard) */}
        <Route path="/dashboard" element={<PrivateRoute user={user}><Dashboard user={user} /></PrivateRoute>} />
        <Route path="/notices" element={<PrivateRoute user={user}><Notices user={user} /></PrivateRoute>} />
        <Route path="/events" element={<PrivateRoute user={user}><Events user={user} /></PrivateRoute>} />
        <Route path="/timetable" element={<PrivateRoute user={user}><Timetable user={user} /></PrivateRoute>} />
        <Route path="/map" element={<PrivateRoute user={user}><MapPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute user={user}><Profile user={user} /></PrivateRoute>} />
        <Route path="/events/:id/attendees" element={<PrivateRoute user={user}><Attendees /></PrivateRoute>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
