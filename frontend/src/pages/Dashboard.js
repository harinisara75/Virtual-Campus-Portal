// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [user, setUser] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const navigate = useNavigate();

  // fetch events
  const loadEvents = async () => {
    try {
      const evRes = await API.get('/api/events');
      setEvents(evRes.data || []);

      // filter joined events if user exists in localStorage
      const rawUser = JSON.parse(localStorage.getItem('vc_user') || 'null');
      if (rawUser && Array.isArray(rawUser.joinedEvents)) {
        const ids = rawUser.joinedEvents.map(e => (typeof e === 'string' ? e : e._id));
        const filtered = (evRes.data || []).filter(e => ids.includes(e._id));
        setJoinedEvents(filtered);
      } else {
        setJoinedEvents([]);
      }
    } catch {
      setEvents([]);
      setJoinedEvents([]);
    }
  };

  // fetch notices
  const loadNotices = async () => {
    try {
      const noRes = await API.get('/api/notices');
      setNotices(noRes.data || []);
    } catch {
      setNotices([]);
    }
  };

  useEffect(() => {
    loadEvents();
    loadNotices();

    const rawUser = localStorage.getItem('vc_user');
    if (rawUser) setUser(JSON.parse(rawUser));
  }, []);

  // handle join button click
  const handleJoin = async (eventId) => {
    try {
      const rawUser = localStorage.getItem('vc_user');
      if (!rawUser) { alert('Please login to join'); return; }

      // call backend to join
      await API.post(`/api/events/${eventId}/join`);
      alert('You joined the event.');

      // fetch fresh user from server and save locally
      try {
        const me = await API.get('/api/auth/me');
        localStorage.setItem('vc_user', JSON.stringify(me.data));
        setUser(me.data);
      } catch (e) {
        // if /me fails, keep existing localUser
        console.warn('Could not refresh user after join', e);
      }

      // refresh lists on dashboard
      await loadEvents();
      loadNotices();

      // navigate to Events page so student sees joined list
      navigate('/events');

      // notify other pages to refresh
      window.dispatchEvent(new Event('vc:userUpdated'));
    } catch (err) {
      console.error('Join failed', err);
      const msg = err?.response?.data?.msg || err?.message || 'Join failed';
      alert('Join failed: ' + msg);
    }
  };

  return (
    <div className="vc-page">
      <aside className="vc-sidebar">
        <div className="vc-brand">Virtual Campus Portal</div>
        <nav className="vc-nav">
          <Link to="/" className="vc-nav-item active">Dashboard</Link>
          <Link to="/notices" className="vc-nav-item">Notices</Link>
          <Link to="/events" className="vc-nav-item">Events</Link>
          <Link to="/timetable" className="vc-nav-item">Timetable</Link>
          <Link to="/map" className="vc-nav-item">Campus Map</Link>
        </nav>
        <div className="vc-sidebar-footer">{user?.role || 'Student'} • {user?.name || 'Demo'}</div>
      </aside>

      <main className="vc-main">
        <header className="vc-main-header">
          <div className="vc-user-mini">Welcome {user?.name || ''}</div>
        </header>

        <section className="vc-grid">
          <div className="vc-left-col">
            <div className="vc-card small-stats">
              <div className="stat-row">
                <div className="stat">Events <div className="stat-num">{events.length}</div></div>
                <div className="stat">Classes <div className="stat-num">5</div></div>
                <div className="stat">Notices <div className="stat-num">{notices.length}</div></div>
              </div>
            </div>

            <div className="vc-card">
              <h3 className="card-title">Upcoming Events</h3>
              {events.length === 0 ? <p className="muted">No upcoming events</p> : (
                <ul className="event-list">
                  {events.slice(0,5).map(ev => (
                    <li key={ev._id} className="event-row" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div>
                        <h4 style={{margin:0}}>{ev.title}</h4>
                        <div className="muted">{new Date(ev.date).toLocaleDateString()} • {ev.place}</div>
                        <div className="muted small">Type: {ev.type || 'general'}</div>
                      </div>
                      <div>
                        { user && (user.role === 'teacher' || user.role === 'admin') ? (
                          <button onClick={() => navigate(`/events/${ev._id}/attendees`)}>View Attendees</button>
                        ) : (
                          <button onClick={() => handleJoin(ev._id)}>Join</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="vc-right-col">
            <div className="vc-card">
              <h3 className="card-title">Latest Notices</h3>
              {notices.length === 0 ? <p className="muted">No notices</p> : (
                <ul className="notice-list">
                  {notices.slice(0,5).map(n => (
                    <li key={n._id}>
                      <div className="notice-title">{n.title}</div>
                      <div className="muted small">{n.message?.slice(0,80)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="vc-card profile-card">
              <h3 className="card-title">Profile</h3>
              <div className="profile-inner">
                <div className="avatar">{user?.name?.[0] || 'A'}</div>
                <div>
                  <div className="profile-name">{user?.name || 'Demo User'}</div>
                  <div className="muted small">Role: {user?.role || 'Student'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
