import React from 'react';

export default function Profile({ user }){
  return (
    <div className='container'>
      <h1>Profile</h1>
      <div className='card'>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}
