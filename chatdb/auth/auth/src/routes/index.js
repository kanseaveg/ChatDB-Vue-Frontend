import React from 'react'
import Login from '../pages/Login'
import Home from '../pages/Home/index.tsx'
const routes = [
    // 登录注册
    {
        path: '/login',
        element: <Login />,
    },
//    chatdb
   {
    path: '/home',
    element: <Home />,
},

// default route
      {
        path: '',
        element: <Login />
    }
 ]
 export default routes 