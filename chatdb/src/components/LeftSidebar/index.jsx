import React, { useEffect, useState, useRef } from 'react'
import { CommentOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { TreeSelect } from 'antd';
import { message } from 'antd';
import axios from 'axios'
import './index.scss'
import { copyArr } from '../../utils/func'

export default function LeftSidebar({ setCurrent, setDeleteNumber, list, setList, setAddText, addFirstChat, setDataSourceId }) {
    const [chat, setChat] = useState([])
    const navigate = useNavigate();
    const [heightChange, setHeightChange] = useState(0)
    const [hide, setHide] = useState(true)
    const [repair, setRepair] = useState([])
    const [treeData, setTreeData] = useState([])
    const [temp, setTemp] = useState(0)
    const [listvalue, setListValue] = useState();
    const token = sessionStorage.getItem('token')
    const line = useRef()
    useEffect(() => {
        if (temp > 0) {
            axios({
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                method: 'GET',
                url: `http://8.134.100.212:8081/api/db/schema/${temp}`,
            }).then(res => {
                let children = []
                res.data.map((v, i) => {
                    children.push({
                        value: v.tableName + Math.random() * 10000,
                        title: v.tableName,
                        db: temp,
                        children: v.tableColumns?.map((value, index) => {
                            return ({
                                value: value + + Math.random() * 10000,
                                title: value,
                                db: temp
                            })
                        })
                    })
                })
                let newTreeData = copyArr(treeData)
                if (newTreeData[temp - 1]) {
                    newTreeData[temp - 1].children = children
                    setTreeData(newTreeData)
                    if (temp < newTreeData.length) {
                        setTemp(temp + 1)
                    }

                }

            }).catch(e => { message.warning('please login again!'); navigate('/login') })
        }
    }, [temp])
    const addNewChat = () => {
        setHide(false)
        setList(list + 1)
    }
    const handleConfirmName = (e) => {
        if (e.keyCode === 13) {
            setHide(true)
            let chats = copyArr(chat)
            chats.push(e.target.value)
            e.target.value = ''
            setChat(chats)
        }
    }
    const changeReapir = (i) => {
        let repairs = copyArr(repair)
        repairs[i] = true
        setRepair(repairs)
    }
    const handleRepair = (e, i) => {
        if (e.keyCode === 13) {
            let repairs = copyArr(repair)
            repairs[i] = false
            setRepair(repairs)
            let chats = copyArr(chat)
            chats[i] = e.target.value
            setChat(chats)
        }
    }
    const deleteChat = (j) => {
        let chats = []
        let i = 0;
        for (i; i < chat.length; i++) {
            if (i !== j) {
                chats.push(chat[i])
            }
        }
        setChat(chats)
        setDeleteNumber(j)
        setList(list - 1)
    }
    const handleSelect = (value, node, extra) => {
        if (node) {
            setAddText(node.title)
            setDataSourceId(node.db)
        }
    }
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
                    title: res.data[i],
                    value: res.data[i],
                    db: i
                })
            }
            setTreeData(treeData)
            setTemp(1)
        }).catch(e => { message.warning('please login again!'); navigate('/login') })
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
    useEffect(() => {
        if (addFirstChat) {
            setHide(true)
            setList(list + 1)
            let chats = copyArr(chat)
            chats.push(addFirstChat)
            setChat(chats)
        }
    }, [addFirstChat])

    return (
        <div className='LeftSidebar'>
            <div className='LeftSidebar-top' style={{ height: `calc(50vh + ${heightChange}px)` }}>
                <div onClick={addNewChat} className='LeftSidebar-addNewChat'>+ &nbsp;&nbsp;New chat</div>
                <ul className='LeftSidebar-chats'>
                    {chat.map((v, i) => {
                        return (<li key={i}><CommentOutlined />&nbsp;&nbsp;&nbsp;&nbsp;{repair[i] ? <input type="text" onKeyDown={(e) => handleRepair(e, i)} style={{ margin: '0' }} className='newChatInput' /> : <div onClick={() => setCurrent(i)} className='LeftSidebar-chats-name'> {v}</div>}&nbsp;&nbsp;&nbsp;&nbsp;<EditOutlined onClick={() => changeReapir(i)} />&nbsp;&nbsp;&nbsp;&nbsp;<DeleteOutlined onClick={() => deleteChat(i)} /></li>)
                    })}
                </ul>
                {chat.length === 0 && hide ? <div className='LeftSidebar-introduction'>Welcome you to use chatDb,Now you can have a try to add new chat. </div> : ''}
                <div className={hide ? 'hidden' : 'newChatInputDiv'}><input onKeyDown={handleConfirmName} type="text" className='newChatInput' placeholder='title of chat' /></div>
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
                    placeholder="activity"
                    onSelect={(value, node, extra) => handleSelect(value, node, extra)}
                    treeData={treeData}
                />
                <div className='LeftSidebar-introduction'>You can choose db to get some correspondingly message</div>
            </div>
        </div>
    )
}
