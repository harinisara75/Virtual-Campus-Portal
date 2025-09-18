import React from 'react';

export default function EventCard({ ev, onJoin }) {
  return (
    <div className='card'>
      <h4>{ev.title}</h4>
      <p>{new Date(ev.date).toLocaleDateString()} • {ev.place}</p>
      { onJoin && <button onClick={()=>onJoin(ev._id)}>Join</button> }
    </div>
  );
}
