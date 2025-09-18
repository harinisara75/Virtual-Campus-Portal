import React from 'react';

export default function MapPage(){
  const places = [
    {name:'Library', info:'Open 9:00 - 17:00. Books: 1200'},
    {name:'Computer Lab', info:'Lab 101, 50 PCs'},
    {name:'Canteen', info:'Veg/Non-Veg, opens 8:00'},
    {name:'Hostel', info:'Warden: +91-XXXXXXXX'}
  ];

  return (
    <div className='container'>
      <h1>Campus Map</h1>
      <div className='map'>
        { places.map(p=> (
          <div className='card place' key={p.name}>
            <h3>{p.name}</h3>
            <p>{p.info}</p>
          </div>
        )) }
      </div>
    </div>
  );
}
