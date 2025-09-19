// src/pages/MapPage.js
import React from 'react';

export default function MapPage(){
  const embed = process.env.REACT_APP_MAP_EMBED || '';
  return (
    <div className='container'>
      <h1>Campus Map</h1>
      {embed ? (
        <div className='card'>
          <iframe src={embed} width='100%' height='450' style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
        </div>
      ) : (
        <div className='card'>
          <p className='muted'>No map embed set. Add REACT_APP_MAP_EMBED to Netlify env with Google Maps embed URL</p>
        </div>
      )}
    </div>
  );
}
