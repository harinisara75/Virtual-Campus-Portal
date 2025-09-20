// frontend/src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Profile({ user }) {
  const [joined, setJoined] = useState([]);

  useEffect(()=>{
    const fetchJoined = async () => {
      try {
        const me = await API.get('/auth/me');
        const joinedIds = me.data.joinedEvents || [];
        const eventsRes = await API.get('/events');
        const all = eventsRes.data || [];
        setJoined(all.filter(e => joinedIds.includes(e._id)));
      } catch (err) { console.error(err); }
    };
    fetchJoined();
  },[]);

  return (
    <div className='container'>
      <h1>Profile</h1>
      <div className='card'>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      <div className='card'>
        <h3>Joined Events</h3>
        { joined.length === 0 ? <p className='muted'>No joined events</p> : (
          <ul>{ joined.map(e => <li key={e._id}>{e.title} • {new Date(e.date).toLocaleDateString()}</li>) }</ul>
        )}
      </div>
    </div>
  );
}
