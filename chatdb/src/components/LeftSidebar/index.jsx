import React, { useEffect, useState, useRef } from 'react'
import { CommentOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { TreeSelect } from 'antd';
import axios from 'axios'
import './index.scss'
export default function LeftSidebar() {
    const [chat, setChat] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    const [heightChange, setHeightChange] = useState(0)
    const [treeData, setTreeData] = useState([])
    const [listvalue, setListValue] = useState();
    const token = sessionStorage.getItem('token')
    const line = useRef()
    const onChange = (newValue) => {
        setListValue(newValue);
    };
    const getDBTreeData = () => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'GET',
            url: `http://8.134.100.212:8081/api/db/list`,
        }).then(res => {
            let treeData = []
            let i = 0
            for (i in res.data) {
                treeData.push({
                    value: res.data[i],
                    title: res.data[i],
                })
            }

        })
    }
    const init = () => {
        //监听鼠标拖动
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
        //获取dbtree
        getDBTreeData()

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
                        return (<li key={i}><CommentOutlined />&nbsp;&nbsp;&nbsp;&nbsp;<div onClick={() => console.log(2)} className='LeftSidebar-chats-name'> SQL code for selectinSQL code for selectin</div>&nbsp;&nbsp;&nbsp;&nbsp;<EditOutlined onClick={() => console.log(1)} />&nbsp;&nbsp;&nbsp;&nbsp;<DeleteOutlined onClick={() => console.log(3)} /></li>)
                    })}
                </ul>
            </div>
            <div ref={line} className='LeftSidebar-line'></div>
            <div className='LeftSidebar-bottom' style={{ height: `calc(50vh - ${heightChange}px)` }}>
                <TreeSelect className='LeftSidebar-bottom-TreeSelect'
                    showSearch
                    treeLine='true'
                    size='large'
                    style={{
                        width: '95%',
                        color: 'white!important'
                    }}
                    value={listvalue}
                    dropdownStyle={{
                        maxHeight: 400,
                        overflow: 'auto',
                    }}
                    placeholder="Please select"
                    allowClear
                    treeDefaultExpandAll
                    onChange={onChange}
                    treeData={treeData}

                />
            </div>
        </div>
    )
}
