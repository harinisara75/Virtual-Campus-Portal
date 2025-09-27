// frontend/src/pages/Notices.js
import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Notices({ user }) {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(()=>{ load(); },[]);

  const load = async () => {
    try {
      const r = await API.get('/api/notices');
      setList(r.data);
    } catch(e){
      console.error(e);
      setList([]);
    }
  };

  const add = async () => {
    if (!user || (user.role!=='teacher' && user.role!=='admin')) { alert('Only teachers can post'); return; }
    try {
      const r = await API.post('/api/notices', { title, message });
      setList(prev => [r.data, ...prev]);
      setTitle(''); setMessage('');
    } catch (e) {
      console.error(e); alert('Post failed');
    }
  };

  const remove = async (id) => {
    if (!user || (user.role!=='teacher' && user.role!=='admin')) { alert('Only teachers can delete'); return; }
    try {
      await API.delete(`/api/notices/${id}`);
      setList(prev => prev.filter(x=>x._id !== id));
    } catch(e){ console.error(e); alert('Delete failed'); }
  };

  return (
    <div className='container'>
      <h1>Notices</h1>

      { user && (user.role==='teacher' || user.role==='admin') && (
        <div className='card'>
          <h3>Post Notice</h3>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder='Title' />
          <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} />
          <button onClick={add}>Post</button>
        </div>
      )}

      <div>
        { list.map(n => (
          <div key={n._id} className='card'>
            <h4>{n.title}</h4>
            <p>{n.message}</p>
            <small className='muted'>By {n.createdBy?.name || 'Admin'} • {new Date(n.createdAt).toLocaleString()}</small>
            { user && (user.role==='teacher' || user.role==='admin') && <button onClick={()=>remove(n._id)} style={{background:'#ff6b6b'}}>Delete</button> }
          </div>
        )) }
      </div>
    </div>
  );
}
