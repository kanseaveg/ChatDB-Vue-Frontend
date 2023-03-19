import React, { useEffect, useState, useRef } from 'react'
import './index.scss'
import temp from '../../logo.svg'
import { FileOutlined, SendOutlined, DeleteOutlined, DoubleRightOutlined, RedoOutlined, SmallDashOutlined } from '@ant-design/icons';
import axios from 'axios'
import { copyArr } from '../../utils/func'
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Space, Table, Tag, Modal, Tooltip } from 'antd';
import head1 from '../../assests/images/head1.png'
import head2 from '../../assests/images/head2.png'
// import bg2 from '../../assests/images/bg2.png'
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
export default function RightMain({ current, deleteNumber, list, addText, setCurrent, setAddFirstChat, dataSourceId, setRefresh, refresh }) {
    // [[{ who: 'ai', content: 'page1你好' }, { who: 'people', content: 'page1你好3' }], [{ who: 'ai', content: 'page2你好' }, { who: 'people', content: 'page2你好3' }]]
    const [chats, setChats] = useState([])
    const navigate = useNavigate();
    const [myCurrent, setMyCurrent] = useState(0)
    const peopleInput = useRef()
    const main = useRef()
    const token = sessionStorage.getItem('token')
    const userId = sessionStorage.getItem('userId')
    const [text, setText] = useState([]);
    //历史记录
    useEffect(() => {
        let Chats = JSON.parse(localStorage.getItem('chats'))
        if (Chats && Chats.length !== 0) {
            setChats(Chats)
            setText(JSON.parse(localStorage.getItem('text')))
        }
    }, [])
    useEffect(() => {
        localStorage.setItem('chats', JSON.stringify(chats))
        localStorage.setItem('text', JSON.stringify(text))
    }, [text, chats])
    //清空对话
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        RefreshOne()
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    //清空所有
    useEffect(() => {
        if (refresh) {
            let newChats = []
            let newText = []
            setChats(newChats)
            setText(newText)
            setRefresh(false)
        }
    }, [refresh])
    //打字机
    const jsonData = ["Ok,here's an example SQL statement to create a basic table in a relational database:", 'To create a basic table in a relational database, you could use a SQL statement like this:', 'If you need to set up a basic table in a relational database, the following SQL statement can be used:', 'The following SQL statement is an example of how to create a simple table in a relational database:', 'When it comes to creating a basic table in a relational database, you might use something like the following SQL statement:'];
    useEffect(() => {
        if (text[current] && text[current].length !== 0) {
            const intervalId = setInterval(() => {
                const char = jsonData[text[current].length % 5].charAt(text[current][text[current].length - 1].length);
                if (char) {
                    let tempText = copyArr(text)
                    tempText[current][tempText[current].length - 1] += char
                    setText(tempText);
                }
            }, 100);
            return () => clearInterval(intervalId);
        }
    }, [text]);
    //执行SQL
    const execute = (i, sql) => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'POST',
            data: {
                data_source_id: dataSourceId,
                query: sql
            },
            url: `http://10.21.76.236:8081/api/db/query`,
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
                let newChats3 = copyArr(chats)
                newChats3[current][i].table = [columns, data]
                setChats(newChats3)
            } else {
                message.warning(res.data.msg)
            }
        })
    }
    //重新生成SQL
    const reProduct = (i) => {
        let newChats = copyArr(chats)
        newChats[current][i] = { who: 'ai' }
        setChats(newChats)
        let value = newChats[current][i - 1].content

        let conversationId = i - 2 < 0 ? '' : newChats[current][i - 2].conversationId || ''
        let parentId = i - 2 < 0 ? '' : newChats[current][i - 2].parentId || ''

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
            url: `http://10.21.76.236:8081/api/chat/query`,
        }).then(res => {
            if (res.data.code === 200) {
                let newChats2 = copyArr(newChats)
                newChats2[current][i].content = res.data.data.answers
                newChats2[current][i].conversationId = res.data.data.conversationId || ''
                newChats2[current][i].parentId = res.data.data.parentId || ''
                setChats(newChats2)
            } else {
                message.warning(res.data.data || res.data.msg)
            }
        }).catch(e => { message.warning(e.response.data.error || "can't find the result") })
    }
    //清空一个
    const RefreshOne = () => {
        let newChats = copyArr(chats)
        newChats[current] = []
        setChats(newChats)
    }
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
                Text.push([''])
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
                    url: `http://10.21.76.236:8081/api/chat/query`,
                }).then(res => {
                    if (res.data.code === 200) {
                        let newChats2 = copyArr(newChats)
                        let length = newChats2.length
                        newChats2[current][length].conversationId = res.data.data.conversationId || ''
                        newChats2[current][length].parentId = res.data.data.parentId || ''
                        newChats2[current][length].content = res.data.data.answers || ''
                        setChats(newChats2)
                    } else {
                        message.warning(res.data.data || res.data.msg)
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
                Text[current].push('')
                setText(Text)
                setChats(newChats1)
                let length = newChats[current].length
                let conversationId = newChats[current][length - 2] ? newChats[current][length - 2].conversationId || '' : ''
                let parentId = newChats[current][length - 2] ? newChats[current][length - 2].parentId || '' : ''
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
                    url: `http://10.21.76.236:8081/api/chat/query`,
                }).then(res => {
                    if (res.data.code === 200) {
                        let newChats2 = copyArr(newChats1)
                        let length = newChats2[current].length
                        newChats2[current][length - 1].content = res.data.data.answers
                        newChats2[current][length - 1].conversationId = res.data.data.conversationId || ''
                        newChats2[current][length - 1].parentId = res.data.data.parentId || ''
                        setChats(newChats2)
                    } else {
                        message.warning(res.data.data || res.data.msg)
                    }
                }).catch(e => { message.warning(e.response.data.error || "can't find the result") })
                // navigate('/login')

            }
        }
    }
    const addNewChat = () => {
        let newChats = copyArr(chats)
        newChats.push([])
        setChats(newChats)
        let newText = copyArr(text)
        newText.push([])
        setText(newText)
    }
    const DeleteChat = (index) => {
        let newChats = []
        let newText = []
        for (let i = 0; i < chats.length; i++) {
            if (i !== index) {
                let temp = copyArr(chats[i])
                newChats.push(temp)
                let temp1 = copyArr(text[i])
                newText.push(temp1)
            }
        }
        setChats(newChats)
        setText(newText)

    }
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            addPeoplechat()
        }
    }
    //下载文件
    const DownloadFile = (query, filetype) => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'POST',
            data: {
                data_source_id: dataSourceId,
                query, filetype
            },
            responseType: 'text/csv',
            url: `http://10.21.76.236:8081/api/db/export`,
        }).then(res => {
            if (res.status === 200) {
                message.success('正在下载中...')
                let blob
                if (filetype === 'csv') {
                    blob = new Blob([res.data], { type: 'text/csv' });
                } else {
                    blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                }
                // 生成下载链接
                const url = URL.createObjectURL(blob);
                console.log(url);
                // 创建a标签并设置下载链接和文件名
                const link = document.createElement('a');
                link.href = url;
                link.download = filetype === 'csv' ? 'data.csv' : 'data.xlsx';
                // 将a标签添加到DOM树中，并模拟点击
                document.body.appendChild(link);
                link.click();

                // 释放资源
                URL.revokeObjectURL(url);
                document.body.removeChild(link);
            } else {
                message.warning('下载失败！')
            }


        }).catch(e => { console.log(e, e); message.warning('Error'); })
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
        <div className='RightMain '>
            <Modal title="清空对话" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>是否清空对话？</p>
            </Modal>
            <div ref={main} className='RightMain-main '>
                <ul>
                    {chats[myCurrent]?.map((v, i) => {
                        return (v.who === 'ai' ? <li key={i} className='RightMain-chatli RightMain-aichat'><img className='RightMain-aichat-head' src={head2} alt="" /><div className='RightMain-aichat-content'>
                            <div className='RightMain-aichat-content-start'>{text[myCurrent] ? text[myCurrent][(i - 1) / 2] : ''}</div>
                            <div className='RightMain-aichat-content-content'>{v.content} <div className='RightMain-aichat-content-tool'><Tooltip placement="rightTop" title={<div >执行SQL</div>}><DoubleRightOutlined onClick={() => execute(i, v.content)} /></Tooltip><Tooltip placement="rightTop" title='重新生成SQL'><RedoOutlined onClick={() => reProduct(i)} /></Tooltip></div></div>
                            {v.table && v.table[0] ? <><Table columns={v.table[0]} dataSource={v.table[1]} /><Tooltip color='white' title={<ul style={{ color: 'black' }} className='RightMain-aichat-content-download'><li onClick={() => DownloadFile(v.content, 'csv')}><FileOutlined />&nbsp; Download as CSV File</li><li onClick={() => DownloadFile(v.content, 'xlsx')}><FileOutlined />&nbsp; Download as Excel File</li></ul>}><SmallDashOutlined className='RightMain-aichat-content-downloadIcon' /></Tooltip> </> : ''}
                        </div></li> :
                            <li key={i} className='RightMain-chatli RightMain-peoplechat'><div className='RightMain-peoplechat-content'>{v.content}</div><img src={head1} alt="" className='RightMain-peoplechat-head' /></li>)

                    })}
                </ul>
            </div>
            <div className='RightMain-bottom'><DeleteOutlined onClick={showModal} className='RightMain-bottom-delete' /><div className='input'><input onKeyDown={handleKeyDown} ref={peopleInput} type="text" /><SendOutlined onClick={addPeoplechat} style={{ marginLeft: "-40px" }} /></div></div>
        </div>
    )
}
