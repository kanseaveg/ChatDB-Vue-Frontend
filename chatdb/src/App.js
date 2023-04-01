import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRoutes } from 'react-router-dom'
import routes from './routes'
import './App.scss'
import './base.css'
import ComingSoon from './pages/CommingSoon';
axios.defaults.withcredentials = true
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
