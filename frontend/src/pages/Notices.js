import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Notices({ user }){
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(()=>{ API.get('/notices').then(r=>setList(r.data)).catch(()=>{}); },[]);

  const add = async ()=>{
    if(user.role !== 'teacher' && user.role !== 'admin'){ alert('Not allowed'); return; }
    await API.post('/notices', { title, message });
    window.location.reload();
  }

  return (
    <div className='container'>
      <h1>Notices</h1>
      { (user.role==='teacher' || user.role==='admin') && (
        <div className='card'>
          <h3>Post Notice</h3>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder='Title' />
          <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder='Message' rows={4} />
          <button onClick={add}>Post</button>
        </div>
      )}
      <div className='list'>
        { list.map(n=> (
          <div key={n._id} className='card'>
            <h4>{n.title}</h4>
            <p>{n.message}</p>
            <small className='muted'>By {n.createdBy?.name || 'Admin'} • {new Date(n.createdAt).toLocaleString()}</small>
          </div>
        )) }
      </div>
    </div>
  );
}
