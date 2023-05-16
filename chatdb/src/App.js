import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRoutes } from 'react-router-dom'
import routes from './routes'
import './App.scss'
import './base.css'
import ComingSoon from './pages/CommingSoon';
axios.defaults.withcredentials = true
axios.interceptors.response.use(
  (response) => {
    // 如果响应中包含新的令牌，则更新localStorage中的令牌
    const newToken = response.headers['x-auth-token'];
    console.log(newToken,response.headers.authorization,'newToken');
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
    if(response.headers.authorization){
      localStorage.setItem('token', response.headers.authorization)
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
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
