import React, { useEffect, useState } from 'react';

import { useRoutes } from 'react-router-dom'
import routes from './routes'
import './App.scss'
import './base.css'
import bg1 from '../src/assests/images/bg1.png'
function App() {
  const element = useRoutes(routes);
  return (
    <div className='App'>
      <img className='bg' src={bg1} alt="" />
      {/* <EffectComposer/> */}
      
            {element}
    </div>
  );
}

export default App;
