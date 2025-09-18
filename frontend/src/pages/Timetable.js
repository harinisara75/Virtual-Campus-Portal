import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Timetable({ user }){
  const [date] = useState(new Date().toISOString().slice(0,10));
  const [periods, setPeriods] = useState([]);

  useEffect(()=>{
    API.get(`/timetable/${date}`).then(r=>setPeriods(r.data.periods || [])).catch(()=>{});
  },[date]);

  const save = async ()=>{
    if(user.role!=='teacher' && user.role!=='admin'){ alert('Not allowed'); return; }
    await API.post('/timetable', { date, periods });
    alert('Saved');
  }

  return (
    <div className='container'>
      <h1>Timetable ({date})</h1>
      { periods.length === 0 && <p className='muted'>No periods set for today</p> }
      { periods.map((p,i)=> <div key={i} className='card'>{p.time} - {p.subject} ({p.teacher})</div> ) }
      { (user.role==='teacher' || user.role==='admin') && <button onClick={save}>Save Timetable</button> }
    </div>
  );
}
