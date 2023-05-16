import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRoutes,useNavigate } from 'react-router-dom'
import routes from './routes'
import './App.scss'
import './base.css'
import URL from './env.js'

axios.defaults.withcredentials = true


function App() {
  const element = useRoutes(routes);
  const navigate = useNavigate();
  let isRefreshingToken = false;
  const requestsQueue = [];
  axios.interceptors.response.use(
    (response) => {
      const originalRequest = response.config;
      if (response.data.code === 401 && !originalRequest._retry&&response.data.msg==='Authorization failure') {
        if (isRefreshingToken) {
          // 将当前请求添加到队列中
          return new Promise((resolve, reject) => {
            requestsQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              // 更新当前请求的令牌
              originalRequest.headers['Authorization'] = newToken;
              // 重新发送请求
              return axios(originalRequest);
            })
            .catch((error) => {
              return Promise.reject(error);
            });
        }
  
        originalRequest._retry = true;
        isRefreshingToken = true;
  
        // 发送刷新令牌的请求
        return axios
          .get(`${URL}/api/user/refreshToken?userId=${localStorage.getItem('userId')}`)
          .then((response) => {
            const newToken = response.data.data;
            localStorage.setItem('token', newToken);
            // 更新所有请求的令牌
            requestsQueue.forEach((request) => {
              request.resolve(newToken);
            });
            requestsQueue.length = 0;
  
            // 重新发送原始请求
            originalRequest.headers['Authorization'] =newToken;
            return axios(originalRequest);
          })
          .catch((error) => {
            requestsQueue.forEach((request) => {
              request.reject(error);
            });
            requestsQueue.length = 0;
  
            // 处理刷新令牌请求失败的情况
            // 例如，跳转到登录页面等
            // ...
            return Promise.reject(error);
          })
          .finally(() => {
            isRefreshingToken = false;
          });
      }
      if(response.data.code === 401&&response.data.msg==='Unauthorized'){
        navigate('/login')
      }
      return response;
    },
    (error) => {
      return error;
    }
  );
  return (
    <div className='App'>
            {element}
            {/* <ComingSoon/> */}
    </div>
  );
}

export default App;
