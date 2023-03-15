import React, { useEffect, useState, useRef } from 'react'
import './index.scss'
import temp from '../../logo.svg'
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios'
import { copyArr } from '../../utils/func'
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Space, Table, Tag } from 'antd';
import head1 from '../../assests/images/head1.png'
import head2 from '../../assests/images/head2.png'

const columns = [
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
]; const data = [
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

    //打字机
    const [jsonData, setJsonData] = useState("Ok,here's an example SQL statement to create a basic table in a relational database:");
    const [text, setText] = useState([]);
    useEffect(() => {
        if (text && text.length !== 0) {
            const intervalId = setInterval(() => {
                const char = jsonData.charAt(text[text.length - 1].length);
                if (char) {
                    let tempText = copyArr(text)
                    tempText[tempText.length - 1] += char
                    console.log(tempText);
                    setText(tempText);
                }
            }, 100);
            return () => clearInterval(intervalId);
        }
    }, [text, jsonData]);


    const addPeoplechat = () => {
        let value = peopleInput.current.value || ''
        if (value) {
            if (chats.length === 0) {
                chats.push([{ who: 'people', content: value }])
                setCurrent(0)
                setAddFirstChat(value)
                peopleInput.current.value = ''
                let newChats = copyArr(chats)
                newChats[current].push({ who: 'ai' })
                let Text = copyArr(text)
                Text.push('')
                setText(Text)
                setChats(newChats)
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
                        let newChats2 = copyArr(newChats)
                        let length = newChats2.length
                        newChats2[current][length].conversationId = res.data.data.conversationId || ''
                        newChats2[current][length].parentId = res.data.data.parentId || ''
                        newChats2[current][length].content = res.data.data.answers || ''
                        console.log(newChats2, 'newChats2', res.data.data.answers, 'answers');
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
                                let newChats3 = copyArr(newChats2)
                                let length = newChats3[current].length
                                newChats3[current][length - 1].table = [columns, data]
                                setChats(newChats3)
                            } else {
                                message.warning(res.data.msg)
                            }
                        })
                    } else {
                        message.warning(res.data.msg)
                    }
                }).catch(e => { message.warning('something wrong') })
                // ; navigate('/login') 
            } else {
                let newChats = copyArr(chats)
                newChats[current].push({ who: 'people', content: value })
                setChats(newChats)
                peopleInput.current.value = ''
                let newChats1 = copyArr(newChats)
                newChats1[current].push({ who: 'ai' })
                let Text = copyArr(text)
                Text.push('')
                setText(Text)
                setChats(newChats1)
                let length = newChats[current].length
                let conversationId = newChats[current][length - 2] ? newChats[current][length - 2].conversationId : ''
                let parentId = newChats[current][length - 2] ? newChats[current][length - 2].parentId : ''
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
                        let newChats2 = copyArr(newChats1)
                        newChats2[current].content = res.data.data.answers
                        newChats2[current].conversationId = res.data.data.conversationId || ''
                        newChats2[current].parentId = res.data.data.parentId || ''
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
                                let newChats3 = copyArr(newChats2)
                                let length = newChats3[current].length
                                newChats3[current][length - 1].table = [columns, data]
                                setChats(newChats3)
                            } else {
                                message.warning(res.data.msg)
                            }
                        })
                    } else {
                        message.warning(res.data.msg)
                    }

                }).catch(e => { message.warning(e.response.data.error) })
                // navigate('/login')

            }
        }
    }
    const addNewChat = () => {
        let newChats = copyArr(chats)
        newChats.push([])
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
                        return (v.who === 'ai' ? <li key={i} className='RightMain-chatli RightMain-aichat'><img className='RightMain-aichat-head' src={head2} alt="" /><div className='RightMain-aichat-content'>
                            <div className='RightMain-aichat-content-start'>{text ? text[(i - 1) / 2] : ''}</div>
                            <div className='RightMain-aichat-content-content'>{v.content}</div>
                            {v.table && v.table[0] ? <Table columns={v.table[0]} dataSource={v.table[1]} /> : ''}
                        </div></li> :
                            <li key={i} className='RightMain-chatli RightMain-peoplechat'><div className='RightMain-peoplechat-content'>{v.content}</div><img src={head1} alt="" className='RightMain-peoplechat-head' /></li>)

                    })}
                </ul>
            </div>
            <div className='RightMain-bottom'><div className='input'><input onKeyDown={handleKeyDown} ref={peopleInput} type="text" /><SendOutlined onClick={addPeoplechat} style={{ marginLeft: "-40px" }} /></div></div>
        </div>
    )
}
