import React, { useEffect, useState, useRef } from 'react'
import './index.scss'
export default function LeftSidebar() {
    const [chat, setChat] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    const [heightChange, setHeightChange] = useState(0)
    const line = useRef()
    const init = () => {
        if (line) {
            // 鼠标被按下
            let getlineoffsetTop = document.querySelector('.LeftSidebar-line')
            const initY = getlineoffsetTop.offsetTop
            const maxMoveY = initY * 0.8

            line.current.onmousedown = (event) => {
                event = event || window.event;
                // 阻止默认事件
                event.preventDefault();
                // 绑定鼠标移动事件
                document.onmousemove = (event2) => {
                    event2 = event2 || window.event;
                    // 计算移动距离 = 当前鼠标坐标 - 鼠标按下坐标
                    var top = event2.clientY - initY;

                    // 判断上下移动距离
                    if (Math.abs(top) >= maxMoveY) {
                        top = top / Math.abs(top) * maxMoveY;
                    }
                    //让他们的高度匹配
                    setHeightChange(top)

                }

                // 绑定一个鼠标松开事件
                document.onmouseup = (e) => {
                    // 取消鼠标移动事件
                    document.onmousemove = null;
                    document.onmouseup = null;

                }
            }
        }
    }
    useEffect(() => {
        init()
    }, [])
    return (
        <div className='LeftSidebar'>
            <div className='LeftSidebar-top' style={{ height: `calc(50vh + ${heightChange}px)` }}>
                <div className='LeftSidebar-addNewChat'>+ &nbsp;&nbsp;New chat</div>
                <ul className='LeftSidebar-chats'>
                    {chat.map((v, i) => {
                        return (<li key={i}>the New Chat</li>)
                    })}
                </ul>
            </div>
            <div ref={line} className='LeftSidebar-line'></div>
            <div className='LeftSidebar-bottom' style={{ height: `calc(50vh - ${heightChange}px)` }}>
                <ul className='LeftSidebar-trees'>
                    {chat.map((v, i) => {
                        return (<li key={i}>the New Chat</li>)
                    })}
                </ul>
            </div>
        </div>
    )
}
