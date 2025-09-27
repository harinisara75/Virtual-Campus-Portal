// frontend/src/pages/Timetable.js
import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Timetable({ user }) {
  const today = new Date().toISOString().slice(0,10);
  const [date, setDate] = useState(today);
  const [periods, setPeriods] = useState([]);

  useEffect(()=>{
    API.get(`/api/timetable/${date}`)
      .then(r => setPeriods(r.data.periods || []))
      .catch(() => setPeriods([]));
  },[date]);

  const addRow = ()=> setPeriods(prev=>[...prev, {time:'', subject:'', teacher:'', room:''}]);
  const updateRow = (i, k, v)=> { const copy = [...periods]; copy[i][k]=v; setPeriods(copy); };

  const save = async () => {
    if (!user || (user.role!=='teacher' && user.role!=='admin')) { alert('Only teachers can save'); return; }
    try {
      await API.post('/api/timetable', { date, periods });
      alert('Saved');
    } catch(e){
      console.error(e);
      alert('Save failed');
    }
  };

  return (
    <div className='container'>
      <h1>Timetable ({date})</h1>
      <input type='date' value={date} onChange={e=>setDate(e.target.value)} />
      <div className='card'>
        { periods.length === 0 && <p className='muted'>No periods set for this date</p> }
        { periods.map((p,i)=>(
          <div key={i} style={{display:'flex', gap:8, marginBottom:6}}>
            <input value={p.time} onChange={e=>updateRow(i,'time',e.target.value)} style={{width:100}} />
            <input value={p.subject} onChange={e=>updateRow(i,'subject',e.target.value)} placeholder='Subject' />
            <input value={p.teacher} onChange={e=>updateRow(i,'teacher',e.target.value)} placeholder='Teacher' />
            <input value={p.room} onChange={e=>updateRow(i,'room',e.target.value)} placeholder='Room' />
          </div>
        )) }
        { (user && (user.role==='teacher' || user.role==='admin')) && (
          <div style={{display:'flex', gap:8}}>
            <button onClick={addRow}>Add period</button>
            <button onClick={save}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
}
