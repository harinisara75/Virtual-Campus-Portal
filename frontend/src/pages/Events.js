import React, { useEffect, useState } from 'react';
import API from '../api';
import EventCard from '../components/EventCard';

export default function Events({ user }){
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');

  useEffect(()=>{ API.get('/events').then(r=>setEvents(r.data)).catch(()=>{}); },[]);

  const create = async ()=>{
    if(user.role!=='teacher' && user.role!=='admin'){ alert('Not allowed'); return; }
    await API.post('/events', { title, date, place });
    window.location.reload();
  }

  const join = async (id) =>{
    await API.post(`/events/${id}/join`);
    window.location.reload();
  }

  return (
    <div className='container'>
      <h1>Events</h1>
      { (user.role==='teacher' || user.role==='admin') && (
        <div className='card'>
          <h3>Create Event</h3>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder='Title' />
          <input value={date} onChange={e=>setDate(e.target.value)} type='date' />
          <input value={place} onChange={e=>setPlace(e.target.value)} placeholder='Place' />
          <button onClick={create}>Create</button>
        </div>
      )}
      <div className='grid'>
        { events.map(ev=> <EventCard key={ev._id} ev={ev} onJoin={join}/> ) }
      </div>
    </div>
  );
}
