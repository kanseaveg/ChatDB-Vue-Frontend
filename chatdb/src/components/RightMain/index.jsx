import React, { useEffect, useState, useRef } from 'react'
import './index.scss'
import temp from '../../logo.svg'
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios'
import { copyArr } from '../../utils/func'
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Space, Table, Tag } from 'antd';
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
]; const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
    },
];
export default function RightMain({ current, deleteNumber, list, addText, setCurrent, setAddFirstChat, dataSourceId }) {
    // [[{ who: 'ai', content: 'page1你好' }, { who: 'people', content: 'page1你好3' }], [{ who: 'ai', content: 'page2你好' }, { who: 'people', content: 'page2你好3' }]]
    const [chats, setChats] = useState([])
    const navigate = useNavigate();
    const [myCurrent, setMyCurrent] = useState(0)
    const peopleInput = useRef()
    const main = useRef()
    const token = sessionStorage.getItem('token')
    const userId = sessionStorage.getItem('userId')

    const addPeoplechat = () => {
        let value = peopleInput.current.value || ''
        if (value) {
            if (chats.length === 0) {
                chats.push([{ who: 'people', content: value }])
                setCurrent(0)
                setAddFirstChat(value)
                peopleInput.current.value = ''
                axios({
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token
                    },
                    method: 'POST',
                    data: {
                        prompt: value,
                        dbId: dataSourceId,
                        userId,
                        conversationId: '',
                        parentId: ''
                    },
                    url: `http://8.134.100.212:8081/api/chat/query`,
                }).then(res => {
                    if (res.data.code === 200) {
                        let newChats = copyArr(chats)
                        newChats[current].push({ who: 'ai', content: res.data.data.answers, conversationId: res.data.data.conversationId, parentId: res.data.data.parentId || '' })
                        setChats(newChats)
                        axios({
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": token
                            },
                            method: 'POST',
                            data: {
                                data_source_id: dataSourceId,
                                query: res.data.data.answers
                            },
                            url: `http://8.134.100.212:8081/api/db/query`,
                        }).then(res => {
                            if (res.data.code === 200) {
                                let columns = []
                                let data = []
                                res.data.data.columns.map((v, i) => {
                                    columns.push({ title: v.name, dataIndex: v.name, key: v.name })
                                })
                                res.data.data.rows.map((v, i) => {
                                    v.key = i
                                })
                                data = res.data.data.rows
                                let newChats2 = copyArr(newChats)
                                let length = newChats2[current].length
                                newChats2[current][length - 1].table = [columns, data]
                                setChats(newChats2)
                            } else {
                                message.warning(res.data.msg)
                            }
                        })
                    } else {
                        message.warning(res.data.msg)
                    }

                }).catch(e => { message.warning('please login again!'); navigate('/login') })

            } else {
                let newChats = copyArr(chats)
                newChats[current].push({ who: 'people', content: value })
                setChats(newChats)
                peopleInput.current.value = ''
                let conversationId = newChats[current][newChats[current].length - 2].conversationId || ''
                let parentId = newChats[current][newChats[current].length - 2].parentId || ''
                axios({
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token
                    },
                    method: 'POST',
                    data: {
                        prompt: value,
                        dbId: dataSourceId,
                        userId,
                        conversationId: conversationId,
                        parentId
                    },
                    url: `http://8.134.100.212:8081/api/chat/query`,
                }).then(res => {
                    if (res.data.code === 200) {
                        newChats[current].push({ who: 'ai', content: res.data.data.answers, conversationId: res.data.data.conversationId })
                        let newChats2 = copyArr(newChats)
                        setChats(newChats2)
                        axios({
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": token
                            },
                            method: 'POST',
                            data: {
                                data_source_id: dataSourceId,
                                query: res.data.data.answers
                            },
                            url: `http://8.134.100.212:8081/api/db/query`,
                        }).then(res => {
                            if (res.data.code === 200) {
                                let columns = []
                                let data = []
                                res.data.data.columns.map((v, i) => {
                                    columns.push({ title: v.name, dataIndex: v.name, key: v.name })
                                })
                                res.data.data.rows.map((v, i) => {
                                    v.key = i
                                })
                                data = res.data.data.rows
                                let newChats2 = copyArr(newChats)
                                let length = newChats2[current].length
                                newChats2[current][length - 1].table = [columns, data]
                                setChats(newChats2)
                            } else {
                                message.warning(res.data.msg)
                            }
                        })
                    } else {
                        message.warning(res.data.msg)
                    }

                }).catch(e => { message.warning('please login again!'); navigate('/login') })

            }
        }
    }
    const addNewChat = () => {
        let newChats = copyArr(chats)
        newChats.push([{ who: 'ai', content: 'Hello~' }])
        setChats(newChats)
    }
    const DeleteChat = (index) => {
        let newChats = []
        for (let i = 0; i < chats.length; i++) {
            if (i !== index) {
                let temp = copyArr(chats[i])
                newChats.push(temp)
            }
        }
        setChats(newChats)
    }
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            addPeoplechat()
        }
    }
    useEffect(() => {
        setMyCurrent(current)
    }, [current])
    useEffect(() => {
        if (main.current) {
            main.current.scroll({
                top: 1000000000,
                behavior: 'smooth'
            });
        }

    }, [chats])
    useEffect(() => {
        if (deleteNumber >= 0) {
            DeleteChat(deleteNumber)
        }
    }, [deleteNumber])
    useEffect(() => {
        if (list > chats.length) {
            addNewChat()
        }
    }, [list])
    useEffect(() => {
        if (addText) {
            peopleInput.current.value += addText
        }
    }, [addText])
    return (
        <div className='RightMain'>
            <div ref={main} className='RightMain-main'>
                <ul>
                    {chats[myCurrent]?.map((v, i) => {
                        return (v.who === 'ai' ? <li key={i} className='RightMain-chatli RightMain-aichat'><img className='RightMain-aichat-head' src={temp} alt="" /><div className='RightMain-aichat-content'>
                            <div className='RightMain-aichat-content-start'>Ok,here's an example SQL statement to create a basic table in a relational database:</div>
                            <div className='RightMain-aichat-content-content'>{v.content}</div>
                            {v.table && v.table[0] ? <Table columns={v.table[0]} dataSource={v.table[1]} /> : ''}
                        </div></li> :
                            <li key={i} className='RightMain-chatli RightMain-peoplechat'><div className='RightMain-peoplechat-content'>{v.content}</div><img className='RightMain-peoplechat-head' src={temp} alt="" /></li>)

                    })}
                </ul>
            </div>
            <div className='RightMain-bottom'><div className='input'><input onKeyDown={handleKeyDown} ref={peopleInput} type="text" /><SendOutlined onClick={addPeoplechat} style={{ marginLeft: "-40px" }} /></div></div>
        </div>
    )
}
