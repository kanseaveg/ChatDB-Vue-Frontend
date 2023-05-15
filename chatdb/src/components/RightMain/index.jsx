import React, { useEffect, useState, useRef } from 'react'
import './index.scss'
import temp from '../../logo.svg'
import { DownloadOutlined, LikeOutlined, DislikeOutlined, CopyOutlined, UploadOutlined, EditOutlined, PauseCircleOutlined, FileOutlined, SendOutlined, DeleteOutlined, DoubleRightOutlined, RedoOutlined, SmallDashOutlined } from '@ant-design/icons';
import axios from 'axios'
import { copyArr, Myreplace } from '../../utils/func'
import { message, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Modal, Tooltip, Button, Spin, Popconfirm, Select, Input } from 'antd';
import head1 from '../../assests/images/head1.png'
import head2 from '../../assests/images/head2.png'
import { v4 as uuidv4 } from "uuid"
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, github, monokai, tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import URL from '../../env.js'
import Introduce from '../Introduce'
import html2canvas from 'html2canvas';
export default function RightMain({ changeModel, setChangeModel, lock, setLock, setDbDisabled, setUploadAndRefresh, setName, current, setDeleteNumber, deleteNumber, list, addText, setAddText, setCurrent, setAddFirstChat, dataSourceId, setRefresh, refresh }) {
    const [chats, setChats] = useState([])
    const navigate = useNavigate();
    const [myCurrent, setMyCurrent] = useState(0)
    const peopleInput = useRef()
    const main = useRef()
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const [loading, setLoading] = useState(false)
    //上传文件
    const props = {
        name: 'file',
        action: `${URL}/api/db/upload`,
        headers: {
            Authorization: token
        },
        data: {
            userId
        },
        showUploadList: false,
        accept: '.xlsx,.xls,.csv,.sql',
        onChange(info, event) {
            setLoading(true)
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                setLoading(false)
                if (info.file.response.code === 200) {
                    message.success(`${info.file.name} file uploaded successfully`, 1);
                    setUploadAndRefresh(true)
                } else {
                    message.warning(info.file.response.msg)
                }
            } else if (info.file.status === 'error') {
                setLoading(false)
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    }
    //用于终止fetch回答
    const controller = new AbortController();
    const signal = controller.signal;
    const [showStopBtn, setShowStopBtn] = useState(false)
    //回答时不得转换数据库
    useEffect(() => {
        if (showStopBtn) {
            setDbDisabled(true)
        } else {
            setDbDisabled(false)
        }
    }, [showStopBtn])
    //历史记录local
    useEffect(() => {
        let chat = JSON.parse(localStorage.getItem('chat'))
        if (!lock) {
            if (chat && chat.length > 0) {
                setLoading(true)
                const promises = chat.map((v, i) => {
                    return axios({
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": token
                        },
                        method: 'GET',
                        url: `${URL}/api/chat/history?userId=${userId}&chatId=${v.chatId}`,
                    }).then(res => {
                        if (res.data.code === 200) {
                            let data = []
                            if (res.data.data.length > 0) {
                                res.data.data.map((v) => {
                                    data.push({ who: v.userType === 'USER' ? 'people' : 'ai', finish: true, content: v.message })
                                })
                            }
                            return data
                        } else {
                            message.warning(res.data.data || res.data.msg)
                        }
                    }).catch(e => { })
                })
                Promise.all(promises).then(newChats => {
                    // 在这里处理所有聊天记录
                    setChats(newChats)
                    setLoading(false)
                })
            }
            setLock(true)
        }
    }, [lock])
    useEffect(() => {
        localStorage.setItem('chats', JSON.stringify(chats))
    }, [chats])
    //终止回答
    const stopResponding = () => {
        controller.abort()
        switch (sessionStorage.getItem('show')) {
            case 'reshow':
                sessionStorage.setItem('show', 'notreshow')
                break;
            case 'show':
                sessionStorage.setItem('show', 'notshow')
                break;
            case 'show1':
                sessionStorage.setItem('show', 'notshow1')
                break;
            default:
                break;
        }
        setShowStopBtn(false)
    }
    //提供反馈
    const [isModalOpen1, setIsModalOpen1] = useState({ flag: false });
    const FeedbackSql = useRef()
    const Feedback = useRef()
    const showModal1 = (i) => {
        setIsModalOpen1({ flag: true, i: i });
    };
    const feedback = (i, goldenSql, feedbackDescription, likeFlag) => {
        const chatId = JSON.parse(localStorage.getItem('chat'))[current].chatId
        const db = JSON.parse(localStorage.getItem('chat'))[current].db.db
        const question = JSON.parse(localStorage.getItem('chats'))[current][i - 1].content
        const currentSql = JSON.parse(localStorage.getItem('chats'))[current][i].content
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'POST',
            data: {
                userId, chatId, db, question, currentSql, goldenSql, feedbackDescription, likeFlag
            },
            url: `${URL}/api/chat/feedback`,
        }).then(res => {
            if (res.data.code === 200) {
                setIsModalOpen1(false);
                let data = copyArr(chats)
                data[current][i].feedback = { flag: likeFlag }
                setChats(data)
                if (Feedback.current && FeedbackSql.current) {
                    Feedback.current.value = ''
                    FeedbackSql.current.value = ''
                }
                message.success(res.data.data || res.data.msg)
            } else {
                message.warning(res.data.data || res.data.msg)
            }
        }).catch(e => { })
    }
    const handleOk1 = (i) => {
        const goldenSql = FeedbackSql.current.value || ''
        const feedbackDescription = Feedback.current.value || ''
        feedback(i, goldenSql, feedbackDescription, false)
    };
    const handleCancel1 = () => {
        setIsModalOpen1({ flag: false });
    };
    //清空对话
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        RefreshOne()
        setIsModalOpen(false);
        if (JSON.parse(localStorage.getItem('chat')) && JSON.parse(localStorage.getItem('chat'))[current]) {
            const chatId = JSON.parse(localStorage.getItem('chat'))[current].chatId
            axios({
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                method: 'POST',
                url: `${URL}/api/chat/clear?userId=${userId}&chatId=${chatId}`,
                data: {
                    userId, chatId
                }
            }).then().catch(e => { })
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    //清空所有
    useEffect(() => {
        if (refresh) {
            let newChats = []
            setChats(newChats)
            setRefresh(false)
        }
    }, [refresh])
    //执行SQL
    const execute = (i, sql, page, pageSize) => {
        sql = 'SELECT' + sql.split('SELECT')[1];
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'POST',
            data: {
                dbname: dataSourceId,
                query: sql,
                userId,
                page,
                pageSize
            },
            url: `${URL}/api/db/query`,
        }).then(res => {
            if (res.data.code === 200) {
                let columns = []
                let data = []
                res.data.data.columns.map((v, i) => {
                    columns.push({
                        title: v, dataIndex: v, key: v, fixed: i === 0 ? true : false, ellipsis: true,

                        width: i === 0 ? 200 : 150
                    })
                })
                res.data.data.rows.map((v, i) => {
                    v.key = i
                })
                data = res.data.data.rows
                let newChats3 = copyArr(chats)
                newChats3[current][i].table = [columns, data, res.data.data.totalCount]
                setChats(newChats3)
            } else {
                message.warning(res.data.msg)
            }
        }).catch((e) => {
            message.warning(e.response.data.data || e.response.data.msg); if (e.response.data.data === 'token wrong or expire, please login again') {
                navigate('/login')
            }
        })
    }
    //重新生成SQL
    const reProduct = (i) => {
        setShowStopBtn(true)
        sessionStorage.setItem('show', 'reshow')
        const chatId = JSON.parse(localStorage.getItem('chat'))[current].chatId
        let newChats = copyArr(chats)
        newChats[current][i] = { who: 'ai', finish: false }
        setChats(newChats)
        let value = encodeURIComponent(newChats[current][i - 1].content)
        let modelType = parseInt(localStorage.getItem('model')) || 2
        let DBType = parseInt(localStorage.getItem('dbType')) || 1
        fetch(`${URL}/api/chat/query?DBType=${DBType}&type=${modelType}&question=${encodeURIComponent(value).replace(/%25/g, '%2525')}&db=${dataSourceId}&userId=${userId}&chatId=${chatId}&re=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
        })
            .then(response => {
                // 使用 ReadableStream API 解析事件流数据并更新 state
                if (sessionStorage.getItem('show') === 'reshow') {
                    const streamReader = response.body.getReader();
                    streamReader.read().then(function processResult(result) {
                        let newChats3 = copyArr(newChats)
                        if (result.done) {
                            setShowStopBtn(false)
                            newChats3[current][i].finish = true
                            sessionStorage.setItem('show', 'finishreshow')
                            return;
                        }
                        let text = new TextDecoder("utf-8").decode(result.value).replace(/data:/g, "").replace(/SQL/g, "").replace(/```/g, "").replace(/sql/g, "").replace(/\n/g, "")
                        if (text) {
                            if (text.includes('message') && text.includes('messageType')) {
                                let count = text.split('}').length
                                if (count === 2) {
                                    let newText = JSON.parse(text).message || ''
                                    if (newChats3[current][i].content) {
                                        newChats3[current][i].content += newText
                                    } else {
                                        newChats3[current][i].content = newText
                                    }
                                    // }

                                } else {
                                    for (let a = 0; a < count; a++) {
                                        let newText = JSON.parse('{' + Myreplace(text.split('}')[a], ['{', '}']) + '}').message || ''
                                        if (newChats3[current][i].content) {
                                            newChats3[current][i].content += newText
                                        } else {
                                            newChats3[current][i].content = newText
                                        }
                                        // }
                                    }
                                }
                            }
                            else {
                                let newText = text.includes('data') ? text.split('"data":"')[1] : text.split('"msg":"')[1]
                                newText = Myreplace(newText, ['{', '}', '"', ':', ',', 'message', 'messageType'])
                                if (newText.includes('token wrong')) {
                                    message.warning('请重新登陆！')
                                    navigate('/login')
                                } else {
                                    newChats3[current][i].content = newText
                                }
                            }
                            setChats(newChats3)
                        }
                        return streamReader.read().then(processResult);
                    });
                }
            })
            .catch(e => {
                message.warning('please login again!', 1)
                navigate('/login')
                    ;
            }
            );
    }
    //编辑SQL
    const edit = (i) => {
        let value = chats[current][i].content
        let sql = ''
        Modal.confirm({
            title: 'Edit SQL',
            closable: true,
            content: (
                <div>
                    <Input.TextArea style={{ width: '90%' }} onChange={(e) => { sql = e.target.value }} defaultValue={value} />
                </div>
            ),
            onOk() {
                if (!sql) {

                } else {
                    if (/^SELECT\s/i.test(sql)) {
                        // SQL 语句符合 SELECT 语句的格式，可以执行
                        let chatId = JSON.parse(localStorage.getItem('chat'))[current].chatId
                        axios({
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": token
                            },
                            method: 'POST',
                            data: {
                                message: {
                                    messageType: 'TEXT',
                                    userType: 'DB',
                                    message: sql
                                },
                                chatId,
                                userId,
                            },
                            url: `${URL}/api/chat/updatehistory`,
                        }).then(res => {
                            if (res.data.code === 200) {
                                message.success(res.data.msg)
                                let newChats = copyArr(chats)
                                newChats[current][i].content = sql
                                setChats(newChats)
                            } else {
                                message.warning(res.data.data || res.data.msg)
                            }
                        }).catch((e) => {
                            console.log(e);
                            message.warning(e.response?.data?.data || e.response?.data?.msg)
                        })
                    } else {
                        // SQL 语句不符合 SELECT 语句的格式，不允许执行
                        message.warning('please check your sql')
                    }
                }

            },
        });
    }
    //清空一个
    const RefreshOne = () => {
        let newChats = copyArr(chats)
        newChats[current] = []
        setChats(newChats)
    }
    //对话
    const addPeoplechat = () => {
        setShowStopBtn(true)
        //处理终止按钮
        let judge = 0
        switch (sessionStorage.getItem('show')) {
            case 'notshow':
                judge = 'show1'
                sessionStorage.setItem('show', 'show1')
                break;
            case 'notshow1':
                judge = 'show'
                sessionStorage.setItem('show', 'show')
                break;
            case 'finishshow':
                judge = 'show'
                sessionStorage.setItem('show', 'show')
                break;
            default:
                judge = 'show'
                sessionStorage.setItem('show', 'show')
                break;
        }
        let value = peopleInput.current.value || ''
        if (value) {
            if (chats.length === 0 || current === -1) {
                const chatId = uuidv4()
                chats.push([{ who: 'people', content: value }])
                let db = JSON.parse(localStorage.getItem('db'))
                current === -1 ? setAddFirstChat({ value, chatId, db }) : setName({ value, chatId, db })
                peopleInput.current.value = ''
                let newChats = copyArr(chats)
                newChats[newChats.length - 1].push({ who: 'ai' })
                setChats(newChats)
                let modelType = parseInt(localStorage.getItem('model')) || 2
                let DBType = parseInt(localStorage.getItem('dbType')) || 1

                fetch(`${URL}/api/chat/query?type=${modelType}&DBType=${DBType}&question=${encodeURIComponent(value).replace(/%25/g, '%2525')}&db=${dataSourceId}&userId=${userId}&chatId=${chatId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token
                    },
                    signal: signal
                })
                    .then(response => {

                        if (sessionStorage.getItem('show') === judge) {
                            // 使用 ReadableStream API 解析事件流数据并更新 state
                            let newChats2 = copyArr(newChats)
                            setChats(newChats2)
                            const streamReader = response.body.getReader();
                            streamReader.read().then(function processResult(result) {
                                let newChats3 = copyArr(newChats2)
                                if (result.done) {
                                    sessionStorage.setItem('show', 'finishshow')
                                    newChats3[newChats3.length - 1][1].finish = true
                                    setShowStopBtn(false)
                                    return;
                                }
                                let text = new TextDecoder("utf-8").decode(result.value).replace(/data:/g, "").replace(/SQL/g, "").replace(/```/g, "").replace(/sql/g, "").replace(/\n/g, "")
                                if (text) {
                                    if (text.includes('message') && text.includes('messageType')) {
                                        let count = text.split('}').length
                                        if (count === 2) {
                                            let newText = JSON.parse(text).message || ''
                                            if (newChats3[newChats3.length - 1][1].content) {
                                                newChats3[newChats3.length - 1][1].content += newText
                                            } else {
                                                newChats3[newChats3.length - 1][1].content = newText
                                            }
                                            // }
                                        } else {
                                            for (let i = 0; i < count; i++) {
                                                let newText = JSON.parse('{' + Myreplace(text.split('}')[i], ['{', '}']) + '}').message || ''
                                                if (newChats3[newChats3.length - 1][1].content) {
                                                    newChats3[newChats3.length - 1][1].content += newText
                                                } else {
                                                    newChats3[newChats3.length - 1][1].content = newText
                                                }
                                            }

                                            // }
                                        }
                                    } else {
                                        let newText = text.includes('data') ? text.split('"data":"')[1] : text.split('"msg":"')[1]
                                        newText = Myreplace(newText, ['{', '}', '"', ':', ',', 'message', 'messageType'])
                                        if (newText.includes('token wrong')) {
                                            message.warning('请重新登陆！')
                                            navigate('/login')
                                        } else {
                                            newChats3[newChats3.length - 1][1].content = newText

                                        }
                                    }

                                    setChats(newChats3)
                                }

                                return streamReader.read().then(processResult);
                            });
                        }

                    })
                    .catch(error => {
                        if (error.name === 'AbortError') {
                        } else {
                            message.warning('please login again!', 1)
                            navigate('/login')
                                ;
                        }
                    })
            } else {
                const chatId = JSON.parse(localStorage.getItem('chat'))[current].chatId
                let newChats = copyArr(chats)
                if (newChats[current].length !== 0) {
                    newChats[current].push({ who: 'people', content: value })
                } else {
                    newChats[current] = [{ who: 'people', content: value }]
                    let db = JSON.parse(localStorage.getItem('db'))
                    setName({ value, db })
                }
                setChats(newChats)
                peopleInput.current.value = ''
                let newChats1 = copyArr(newChats)
                newChats1[current].push({ who: 'ai' })
                setChats(newChats1)
                let modelType = parseInt(localStorage.getItem('model')) || 2
                let DBType = parseInt(localStorage.getItem('dbType')) || 1

                fetch(`${URL}/api/chat/query?DBType=${DBType}&type=${modelType}&question=${encodeURIComponent(value).replace(/%25/g, '%2525')}&db=${dataSourceId}&userId=${userId}&chatId=${chatId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token
                    },
                    signal: signal
                })
                    .then(response => {
                        // 使用 ReadableStream API 解析事件流数据并更新 state
                        if (sessionStorage.getItem('show') === judge) {
                            const streamReader = response.body.getReader();
                            streamReader.read().then(function processResult(result) {
                                let newChats3 = copyArr(newChats1)
                                let length = newChats3[current].length
                                if (result.done) {
                                    sessionStorage.setItem('show', 'finishshow')
                                    newChats3[current][length - 1].finish = true
                                    setShowStopBtn(false)
                                    return;
                                }
                                let text = new TextDecoder("utf-8").decode(result.value).replace(/data:/g, "").replace(/SQL/g, "").replace(/```/g, "").replace(/sql/g, "").replace(/\n/g, "")
                                if (text) {
                                    if (text.includes('message') && text.includes('messageType')) {
                                        let count = text.split('}').length
                                        if (count === 2) {
                                            let newText = JSON.parse(text).message || ''
                                            if (newChats3[current][length - 1].content) {
                                                newChats3[current][length - 1].content += newText
                                            } else {
                                                newChats3[current][length - 1].content = newText
                                            }
                                            // }

                                        } else {
                                            for (let i = 0; i < count; i++) {
                                                let newText = JSON.parse('{' + Myreplace(text.split('}')[i], ['{', '}']) + '}').message || ''
                                                if (newChats3[current][length - 1].content) {
                                                    newChats3[current][length - 1].content += newText
                                                } else {
                                                    newChats3[current][length - 1].content = newText
                                                }
                                                // }
                                            }
                                        }

                                    } else {
                                        let newText = text.includes('data') ? text.split('"data":"')[1] : text.split('"msg":"')[1]
                                        newText = Myreplace(newText, ['{', '}', '"', ':', ',', 'message', 'messageType'])
                                        if (newText && newText.includes('token wrong')) {
                                            message.warning('请重新登陆！')
                                            navigate('/login')
                                        } else {
                                            newChats3[current][length - 1].content = newText

                                        }
                                    }
                                    setChats(newChats3)
                                }
                                return streamReader.read().then(processResult);
                            });
                        }

                    })
                    .catch(error => {
                        if (error.name === 'AbortError') {
                        } else {
                            message.warning('please login again!', 1)
                            navigate('/login')
                        }
                    });
            }
        }
    }
    //增加新会话
    const addNewChat = () => {
        let newChats = copyArr(chats)
        newChats.unshift([])
        setChats(newChats)
    }
    //删除会话
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
    //监听input框回车
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
                dbname: dataSourceId,
                query, filetype, userId
            },
            responseType: 'arraybuffer',
            url: `${URL}/api/db/export`,
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
                const url = window.URL.createObjectURL(blob);
                // 创建a标签并设置下载链接和文件名
                const link = document.createElement('a');
                link.href = url;
                link.download = filetype === 'csv' ? 'data.csv' : 'data.xlsx';
                // 将a标签添加到DOM树中，并模拟点击
                document.body.appendChild(link);
                link.click();

                // 释放资源
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            } else {
                message.warning('下载失败！')
            }


        }).catch(e => { message.warning('Error'); })
    }
    //监听current
    useEffect(() => {
        setMyCurrent(current)
    }, [current])
    //滑到底部
    useEffect(() => {
        setTimeout(() => {
            if (main.current) {
                main.current.scroll({
                    top: 1000000000,
                    behavior: 'smooth'
                });
            }
        }, 1)
    }, [chats.length, chats[current]?.length])
    //监听左侧删除会话
    useEffect(() => {
        if (deleteNumber >= 0) {
            DeleteChat(deleteNumber)
            if (deleteNumber === myCurrent && showStopBtn) {
                setShowStopBtn(false)
                sessionStorage.setItem('show', 'not')
            }
            setDeleteNumber(-1)
        }
    }, [deleteNumber])
    //监听增加会话
    useEffect(() => {
        if (list >= chats.length) {
            addNewChat()
        }
    }, [list, current])
    //监听左侧db文字映射输入框
    useEffect(() => {
        if (addText) {
            peopleInput.current.value += addText
            setAddText('')
        }
    }, [addText])
    //复制
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };
    //导出聊天记录
    const exportHistory = () => {
        if (main.current) {
            html2canvas(main.current.children[0]).then(canvas => {
                // 创建一个链接，并将 Canvas 转换为 Blob 对象
                const link = document.createElement('a');
                link.download = 'screenshot.png';
                canvas.toBlob(blob => {
                    // 创建一个 Blob URL，并将其作为链接的 href 属性
                    const url = window.URL.createObjectURL(blob);
                    link.href = url;
                    // 模拟点击链接，导出 PNG 文件
                    link.click();
                    // 释放 Blob URL
                    window.URL.revokeObjectURL(url);
                }, 'image/png');
            });
        }

    }
    //切换语言模型
    const modelChange = (value) => {
        if (value !== changeModel.type) {
            localStorage.setItem('model', value)
            setChangeModel({ type: value, add: true })
        }
    }
    const [save, setSave] = useState(false)
    //获取当前会话保存信息
    useEffect(() => {
        let chat = JSON.parse(localStorage.getItem('chat'))
        if (chat && chat[current]) {
            setSave(chat[current].save ? true : false)
        } else {
            setSave(false)
        }
    }, [localStorage.getItem('current'), localStorage.getItem('chat')])
    return (
        <div className='RightMain '>
            {loading ? <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: "100", width: '100%', height: "100%", background: 'rgba(255,255,255,.8)' }}><Spin size="large">
                <div className="content" />
            </Spin></div> : ''}
            <div className={(chats[myCurrent] && chats[myCurrent].length !== 0) || save ? 'RightTopModel modelDisabled' : 'RightTopModel'} >
                {(chats[myCurrent] && chats[myCurrent].length !== 0) || save ?
                    parseInt(localStorage.getItem('model')) === 1 ? '单轮对话模型' : '多轮对话模型'
                    : <Select
                        defaultValue={0}
                        style={{
                            width: 250,
                        }}
                        value={!changeModel || !changeModel.type || changeModel.type === -1 ? 2 : changeModel.type}
                        onChange={modelChange}
                        options={[
                            {
                                value: 2,
                                label: <div >Default(多轮对话模型)</div>,
                            },
                            // {
                            //     value: 1,
                            //     label: <div >单轮对话模型</div>,
                            // },
                        ]}
                    />}

            </div>
            {myCurrent === -1 || (chats[myCurrent] && chats[myCurrent].length) === 0 ? <Introduce myCurrent={myCurrent} setAddText={setAddText} /> : ''}
            <Modal title="清空对话" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>是否清空对话？</p>
            </Modal>
            <Modal
                footer={[
                    <Button key="submit" type="primary" onClick={() => handleOk1(isModalOpen1.i)}>
                        Submit feedback
                    </Button>,
                ]}
                title={<div style={{ display: 'flex', alignItems: 'center', fontWeight: 400 }}><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgb(254, 226, 226)', width: '40px', height: '40px', borderRadius: '20px' }}>
                    <DislikeOutlined style={{ color: 'rgba(255,0,0,.5)', fontSize: '23px', }} /></div> &nbsp;&nbsp; Provide additional feedback</div>}
                open={isModalOpen1.flag} onCancel={handleCancel1}>
                <input ref={FeedbackSql} maxLength='255' placeholder='Enter an appropriate golden SQL statement that you think is suitable.' className='RightMain-feedbacksql' style={{ width: '100%' }} type="text" name="" id="" />
                <textarea ref={Feedback} maxLength='255' placeholder='Please give us the reason why you choose it as your golden SQL.' className='RightMain-feedback' style={{ width: '100%' }} type="text" name="" id="" />
            </Modal>

            <div ref={main} className='RightMain-main '>

                <ul>
                    {chats[myCurrent] ? chats[myCurrent].map((v, i) => {
                        return (v.who === 'ai' ? <li key={i} className='RightMain-chatli RightMain-aichat'><img className='RightMain-aichat-head' src={head2} alt="" /><div className='RightMain-aichat-content'>
                            <div className='RightMain-aichat-content-content'>
                                {/* coy ,funky,okaidia,solarizedlight */}
                                {v.content ? <div className='RightMain-aichat-content-typeCopy' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    sql
                                    <CopyToClipboard text={v.content} onCopy={handleCopy}>
                                        <button className='copyBtn'><CopyOutlined /> {copied ? "Copied!" : "Copy"}</button>
                                    </CopyToClipboard>
                                </div> : ''}
                                <SyntaxHighlighter language='sql' style={docco}>
                                    {v.content}
                                </SyntaxHighlighter>
                                {v.finish ?
                                    <div className='RightMain-aichat-content-tool'>
                                        <Tooltip placement="rightTop" title={<div >执行SQL</div>}><DoubleRightOutlined onClick={() => execute(i, v.content, 1, 10)} /></Tooltip>
                                        {i === chats[myCurrent].length - 1 ? <><Tooltip placement="rightTop" title='编辑SQL'><EditOutlined onClick={() => edit(i)} /></Tooltip> <Tooltip placement="rightTop" title='重新生成SQL'><RedoOutlined onClick={() => reProduct(i)} /></Tooltip></> : ''}
                                        {v.feedback ? v.feedback.flag ? <LikeOutlined className='feedbackSelete' /> : <DislikeOutlined className='feedbackSelete' />
                                            : <><LikeOutlined onClick={() => feedback(i, '', '', true)} /><DislikeOutlined onClick={() => showModal1(i)} /></>} </div> : ''}</div>
                            {v.table && v.table[0] ? <><Table pagination={{ total: v.table[2] }} onChange={(pagination) => execute(i, v.content, pagination.current, pagination.pageSize)}
                                columns={v.table[0].map((v, i) => {
                                    v.render = (v) => (
                                        <div style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onDoubleClick={() => Modal.info({
                                            width: 1000,
                                            closable: true,
                                            footer: false,
                                            icon: null,
                                            bodyStyle: { wordBreak: 'break-all' },
                                            content: (
                                                <div>
                                                    <p>{v}</p>
                                                </div>
                                            ),
                                            onOk() { },
                                        })}>{v}</div>

                                    )
                                    return v
                                })} dataSource={v.table[1]} /><Tooltip color='white' title={<ul style={{ color: 'black' }} className='RightMain-aichat-content-download'><li onClick={() => DownloadFile(v.content, 'csv')}><FileOutlined />&nbsp; Download as CSV File</li><li onClick={() => DownloadFile(v.content, 'xlsx')}><FileOutlined />&nbsp; Download as Excel File</li></ul>}><SmallDashOutlined className='RightMain-aichat-content-downloadIcon' /></Tooltip> </> : ''}
                        </div></li> :
                            <li key={i} className='RightMain-chatli RightMain-peoplechat'><div className='RightMain-peoplechat-content'>{v.content}</div><img src={head1} alt="" className='RightMain-peoplechat-head' /></li>)

                    }) : ''}
                </ul>
            </div>
            <div className='RightMain-bottom'>
                {showStopBtn ?
                    <div className='RightMain-bottom-stopBtn'><Button onClick={stopResponding} className='RightMain-bottom-stopButton' style={{ background: 'rgb(242, 201, 125)!important' }}><PauseCircleOutlined style={{ color: 'white' }} />  Stop Responding</Button></div>
                    : ''}
                <DeleteOutlined onClick={showModal} className='RightMain-bottom-delete' />
                <Tooltip placement="top" title='上传数据库'>
                    <Upload {...props}>
                        <Button className='RightMain-bottom-upload' icon={<UploadOutlined />}></Button>
                    </Upload></Tooltip>
                <Popconfirm
                    title="导出聊天记录"
                    description="您确定要导出聊天记录吗?"
                    onConfirm={exportHistory}
                    okText="Yes"
                    cancelText="No"
                ><DownloadOutlined className='RightMain-bottom-downlaod' /></Popconfirm>
                <div className='input'><input placeholder='Ask anything about your Database!' disabled={showStopBtn} onKeyDown={handleKeyDown} ref={peopleInput} type="text" /><SendOutlined onClick={addPeoplechat} style={{ marginLeft: "-40px" }} /></div></div>
        </div>
    )
}
