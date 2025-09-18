import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard(){
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  useEffect(()=>{
    API.get('/events').then(r=>setEvents(r.data)).catch(()=>{});
    API.get('/notices').then(r=>setNotices(r.data)).catch(()=>{});
  },[]);
  return (
    <div className='container'>
      <h1>Dashboard</h1>
      <div className='grid'>
        <div className='card'>
          <h3>Upcoming Events</h3>
          {events.length === 0 ? <p className='muted'>No events</p> : events.slice(0,5).map(e=>(
            <div key={e._id} style={{marginBottom:8}}>
              <div className='event-poster'><strong>{e.title}</strong><div><small>{new Date(e.date).toLocaleDateString()}</small></div></div>
            </div>
          ))}
        </div>
        <div className='card'>
          <h3>Latest Notices</h3>
          {notices.length === 0 ? <p className='muted'>No notices</p> : notices.slice(0,5).map(n=>(
            <div key={n._id}><div className='notice-title'>{n.title}</div><div><small className='muted'>{new Date(n.createdAt).toLocaleString()}</small></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
