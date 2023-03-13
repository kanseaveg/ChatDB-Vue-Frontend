import React from 'react'
import { Navigate} from 'react-router-dom'
import Login from '../pages/Login'
import ChatDb from '../pages/ChatDb'

const routes = [
    //登录注册
    {
        path: '/login',
        element: <Login />,
    },
   //chatdb
   {
    path: '/chatdb',
    element: <ChatDb />,
},
      {
        path: '',
        element: <Navigate to={sessionStorage.getItem('token')?'chatdb':'/login'} />
    }
 ]
 export default routes 