/* eslint-disable */
import React, { useEffect, useState } from 'react';
import API from '../api';

function safeParseUserFromStorage() {
  try {
    const raw = localStorage.getItem('vc_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

export default function Profile({ user: propUser }) {
  const [me, setMe] = useState(propUser || safeParseUserFromStorage());
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      let meRes = null;
      try { meRes = await API.get('/auth/me'); if (meRes.data) setMe(meRes.data); } catch (_) {}

      const stored = safeParseUserFromStorage();
      const meObj = meRes?.data || stored || me || propUser;

      if (meObj && Array.isArray(meObj.joinedEvents) && meObj.joinedEvents.length > 0) {
        const joinedIds = meObj.joinedEvents.map(x => (typeof x === 'string' ? x : x._id));
        const ev = await API.get('/events');
        const all = ev.data || [];
        setJoined(all.filter(e => joinedIds.includes(e._id)));
        setLoading(false);
        return;
      }

      const userId = meObj?._id || meObj?.id || stored?._id || stored?.id;
      if (userId) {
        const ev = await API.get('/events');
        const all = ev.data || [];
        setJoined(all.filter(e => Array.isArray(e.attendees) && e.attendees.includes(userId)));
        setLoading(false);
        return;
      }

      setJoined([]);
      setLoading(false);
      return;
    } catch (err) {
      console.error('[Profile] Unexpected error', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('vc:userUpdated', handler);
    const onVis = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('vc:userUpdated', handler);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="container">
      <h1>Profile</h1>

      <div className="card">
        <p><strong>Name:</strong> {me?.name || 'No name'}</p>
        <p><strong>Email:</strong> {me?.email || '—'}</p>
        <p><strong>Role:</strong> {me?.role ? String(me.role).charAt(0).toUpperCase() + String(me.role).slice(1) : 'N/A'}</p>
      </div>

      <div className="card">
        <h3>Joined Events</h3>
        { loading ? <p className="muted">Loading...</p> : (
          joined.length === 0 ? <p className="muted">No joined events</p> : (
            <ul>
              {joined.map(e => <li key={e._id}><strong>{e.title}</strong> — <span className="muted">{new Date(e.date).toLocaleDateString()}</span></li>)}
            </ul>
          )
        )}
      </div>
    </div>
  );
}
