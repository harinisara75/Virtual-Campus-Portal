// src/pages/Events.js
import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Events({ user }) {
  const [events, setEvents] = useState([]);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [etype, setEtype] = useState('general');

  useEffect(() => {
    loadEvents();
    const handler = () => loadEvents();
    window.addEventListener('vc:userUpdated', handler);
    return () => window.removeEventListener('vc:userUpdated', handler);
  }, []);

  const loadEvents = async () => {
    try {
      // 1. fetch all events
      const res = await API.get('/api/events');
      const allEvents = (res.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));

      // 2. fetch the fresh current user from backend
      let currentUser = null;
      try {
        const me = await API.get('/api/auth/me');
        currentUser = me.data;
        localStorage.setItem('vc_user', JSON.stringify(currentUser));
      } catch (e) {
        const raw = localStorage.getItem('vc_user');
        if (raw) currentUser = JSON.parse(raw);
      }

      // 3. filter for student accounts
      if (currentUser && currentUser.role === 'student') {
        const joinedIds = (currentUser.joinedEvents || []).map(x =>
          typeof x === 'string' ? x : x._id
        );
        setEvents(allEvents.filter(e => joinedIds.includes(e._id)));
      } else {
        // teachers/admin → show all
        setEvents(allEvents);
      }
    } catch (err) {
      console.error('load events', err);
      setEvents([]);
    }
  };

  const join = async (id) => {
    if (!user) { alert('Please login to join'); return; }
    try {
      await API.post(`/api/events/${id}/join`);
      alert('You joined the event.');
      await loadEvents(); // reload events for THIS account only
      window.dispatchEvent(new Event('vc:userUpdated'));
    } catch (err) {
      console.error('Join failed', err);
      alert('Join failed: ' + (err?.response?.data?.msg || 'Check console'));
    }
  };

  const create = async () => {
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      alert('Only teachers can create'); return;
    }
    try {
      const res = await API.post('/api/events', { title, date, place, type: etype });
      setEvents(prev => [res.data, ...prev]);
      setTitle(''); setDate(''); setPlace('');
    } catch (err) { console.error(err); alert('Create failed'); }
  };

  const remove = async (id) => {
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      alert('Only teachers can delete'); return;
    }
    try {
      await API.delete(`/api/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) { console.error(err); alert('Delete failed'); }
  };

  const upcoming = events.filter(e => new Date(e.date) >= new Date(new Date().toDateString()));

  return (
    <div className='container'>
      <h1>{user?.role === 'student' ? 'My Joined Events' : 'Events'}</h1>

      {user && (user.role === 'teacher' || user.role === 'admin') && (
        <div className='card'>
          <h3>Create Event</h3>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Title' />
          <input value={date} onChange={e => setDate(e.target.value)} type='date' />
          <input value={place} onChange={e => setPlace(e.target.value)} placeholder='Place' />
          <select value={etype} onChange={e => setEtype(e.target.value)}>
            <option value='general'>General</option>
            <option value='exam'>Exam</option>
            <option value='hostel'>Hostel</option>
            <option value='college'>College</option>
            <option value='sports'>Sports</option>
          </select>
          <button onClick={create}>Create</button>
        </div>
      )}

      <div className='grid'>
        {upcoming.length === 0 ? <p className='muted'>No events</p> : upcoming.map(ev => (
          <div key={ev._id} className='card' style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <h4 style={{margin:0}}>{ev.title}</h4>
              <div className='muted'>{new Date(ev.date).toLocaleDateString()} • {ev.place}</div>
              <div className='muted small'>Type: {ev.type || 'general'}</div>
            </div>
            <div>
              {user && (user.role === 'teacher' || user.role === 'admin') ? (
                <button onClick={() => remove(ev._id)} style={{background:'#ff6b6b'}}>Delete</button>
              ) : (
                <button disabled>Joined</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
