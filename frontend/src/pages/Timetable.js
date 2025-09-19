// src/pages/Timetable.js
import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Timetable({ user }) {
  const today = new Date().toISOString().slice(0,10);
  const [date, setDate] = useState(today);
  const [periods, setPeriods] = useState([{time:'09:00', subject:'', teacher:'', room:''}]);

  useEffect(()=>{
    API.get(`/timetable/${date}`).then(r=>{
      setPeriods(r.data.periods || []);
    }).catch(()=>{});
  },[date]);

  const addRow = ()=> setPeriods([...periods, {time:'', subject:'', teacher:'', room:''}]);
  const updateRow = (i, field, val)=>{
    const copy = [...periods]; copy[i][field]=val; setPeriods(copy);
  };
  const save = async ()=>{
    if(user.role!=='teacher' && user.role!=='admin'){ alert('Only teachers can save.'); return; }
    await API.post('/timetable', { date, periods });
    alert('Saved');
  };

  return (
    <div className='container'>
      <h1>Timetable ({date})</h1>
      <input type='date' value={date} onChange={e=>setDate(e.target.value)} />
      <div className='card'>
        {periods.map((p,i)=>(
          <div key={i} style={{display:'flex', gap:8, marginBottom:6}}>
            <input value={p.time} onChange={e=>updateRow(i,'time',e.target.value)} style={{width:100}} />
            <input value={p.subject} onChange={e=>updateRow(i,'subject',e.target.value)} placeholder='Subject' />
            <input value={p.teacher} onChange={e=>updateRow(i,'teacher',e.target.value)} placeholder='Teacher' />
            <input value={p.room} onChange={e=>updateRow(i,'room',e.target.value)} placeholder='Room' />
          </div>
        ))}
        <button onClick={addRow}>Add period</button>
        { (user.role==='teacher' || user.role==='admin') && <button onClick={save}>Save</button> }
      </div>
    </div>
  );
}
