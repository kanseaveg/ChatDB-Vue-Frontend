import React, { useEffect, useState } from 'react';

import { useRoutes } from 'react-router-dom'
import routes from './routes'
import './App.scss'
import './base.css'
import ComingSoon from './pages/CommingSoon';
function App() {
  const element = useRoutes(routes);
  return (
    <div className='App'>
            {element}
            {/* <ComingSoon/> */}
    </div>
  );
}

export default App;
