// frontend/src/pages/Attendees.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function Attendees() {
  const { id } = useParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/api/events/${id}/attendees`);
        setList(res.data || []);
      } catch (err) {
        console.error('Load attendees', err);
        alert('Failed to load attendees: ' + (err?.response?.data?.msg || err?.message));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="container">
      <h1>Attendees</h1>
      {loading ? <p>Loading...</p> : (
        list.length === 0 ? <p>No attendees yet</p> : (
          <ul>{list.map(u => <li key={u._id}><strong>{u.name}</strong> — {u.email}</li>)}</ul>
        )
      )}
    </div>
  );
}
