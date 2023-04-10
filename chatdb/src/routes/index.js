import React from 'react'
import { Navigate} from 'react-router-dom'
import Login from '../pages/Login'
import ChatDb from '../pages/ChatDb'
import ComingSoon from '../pages/CommingSoon'
const routes = [
    // 登录注册
    {
        path: '/login',
        element: <Login />,
    },
//    chatdb
   {
    path: '/chatdb',
    element: <ChatDb />,
},
//comming soon commingsoon
{
    path: '/commingsoon',
    element: <ComingSoon />,
},
//默认路由
      {
        path: '',
        element: <ComingSoon />
    }
 ]
 export default routes 