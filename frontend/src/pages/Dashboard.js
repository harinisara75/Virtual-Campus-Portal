// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    API.get('/events').then(r => setEvents(r.data)).catch(()=>setEvents([]));
    API.get('/notices').then(r => setNotices(r.data)).catch(()=>setNotices([]));
  }, []);

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

        <div className="vc-sidebar-footer">Student • Demo</div>
      </aside>

      <main className="vc-main">
        <header className="vc-main-header">
          <div className="vc-search-box"><input placeholder="Search..." /></div>
          <div className="vc-user-mini">Welcome</div>
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
                    <li key={ev._id} className="event-row">
                      <div>
                        <strong>{ev.title}</strong>
                        <div className="muted">{new Date(ev.date).toLocaleDateString()}</div>
                      </div>
                      <button className="btn-join">Join</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
          </div>

          <div className="vc-right-col">
            <div className="vc-card events-grid">
              <h3 className="card-title">Events</h3>
              <div className="events-grid-inner">
                {events.slice(0,6).map(ev => (
                  <div className="event-card" key={ev._id}>
                    <div className="event-thumb" />
                    <div className="event-info">
                      <div className="event-title">{ev.title}</div>
                      <div className="muted small">{new Date(ev.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <div className="muted">No events to show</div>}
              </div>
            </div>

            <div className="vc-card map-card">
              <h3 className="card-title">Campus Map</h3>
              <div className="map-placeholder">Map — click to view</div>
            </div>

            <div className="vc-card profile-card">
              <h3 className="card-title">Profile</h3>
              <div className="profile-inner">
                <div className="avatar">A</div>
                <div>
                  <div className="profile-name">Teacher One</div>
                  <div className="muted small">Role: Teacher</div>
                </div>
              </div>
              <div className="joined-events">
                <h4>Joined Events</h4>
                <ul>
                  {events.slice(0,3).map(e => <li key={e._id} className="muted small">{e.title}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
