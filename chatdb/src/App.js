import React, { useEffect, useState } from 'react';

import { useRoutes } from 'react-router-dom'
import routes from './routes'
import './App.scss'
import './base.css'
function App() {
  const element = useRoutes(routes);
  return (
    <div className='App'>
            {element}
    </div>
  );
}

export default App;
