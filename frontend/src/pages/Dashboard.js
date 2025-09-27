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

  // helper: safe parse local user
  const getLocalUser = () => {
    try {
      const raw = localStorage.getItem('vc_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  };

  const loadEvents = async () => {
    try {
      const evRes = await API.get('/api/events');
      const arr = evRes.data || [];
      setEvents(arr);

      const rawUser = getLocalUser();
      if (rawUser && Array.isArray(rawUser.joinedEvents)) {
        const ids = rawUser.joinedEvents.map(e => (typeof e === 'string' ? e : e._id));
        const filtered = arr.filter(e => ids.includes(e._id));
        setJoinedEvents(filtered);
      } else {
        setJoinedEvents([]);
      }
    } catch (err) {
      console.error('loadEvents error', err);
      setEvents([]);
      setJoinedEvents([]);
    }
  };

  const loadNotices = async () => {
    try {
      const noRes = await API.get('/api/notices');
      setNotices(noRes.data || []);
    } catch (err) {
      console.error('loadNotices error', err);
      setNotices([]);
    }
  };

  useEffect(() => {
    // initial load
    loadEvents();
    loadNotices();

    const local = getLocalUser();
    if (local) setUser(local);

    // listen for updates: events created/deleted
    const onEventsUpdated = () => loadEvents();
    // listen for user changes (login/logout/join)
    const onUserUpdated = () => {
      const lu = getLocalUser();
      setUser(lu);
      loadEvents();
      loadNotices();
    };

    window.addEventListener('vc:eventsUpdated', onEventsUpdated);
    window.addEventListener('vc:userUpdated', onUserUpdated);

    return () => {
      window.removeEventListener('vc:eventsUpdated', onEventsUpdated);
      window.removeEventListener('vc:userUpdated', onUserUpdated);
    };
  }, []);

  const handleJoin = async (eventId) => {
    try {
      const rawUser = localStorage.getItem('vc_user');
      if (!rawUser) { alert('Please login to join'); return; }

      await API.post(`/api/events/${eventId}/join`);
      alert('You joined the event.');

      // refresh user from server
      try {
        const me = await API.get('/api/auth/me');
        localStorage.setItem('vc_user', JSON.stringify(me.data));
        setUser(me.data);
      } catch (e) {
        console.warn('Could not refresh user after join', e);
      }

      // reload lists
      await loadEvents();
      loadNotices();

      // go to events page
      navigate('/events');

      // notify other pages
      window.dispatchEvent(new Event('vc:userUpdated'));
    } catch (err) {
      console.error('Join failed', err);
      const msg = err?.response?.data?.msg || err?.message || 'Join failed';
      alert('Join failed: ' + msg);
    }
  };

  // small safe date helper for display
  const safeDateStr = (d) => {
    if (!d) return 'TBD';
    const t = Date.parse(String(d));
    if (isNaN(t) || t <= 0) return 'TBD';
    return new Date(t).toLocaleDateString();
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
                        <div className="muted">{safeDateStr(ev.date)} • {ev.place || 'TBD'}</div>
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

              <div style={{marginTop:12}}>
                <h4>Joined Events</h4>
                {joinedEvents.length === 0 ? <p className="muted">No joined events</p> : (
                  <ul>
                    {joinedEvents.map(e => <li key={e._id} className="muted small">{e.title} — {safeDateStr(e.date)}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
