import React, { useEffect, useState, useRef } from 'react'
import './index.scss'
import temp from '../../logo.svg'
import { CopyOutlined, UploadOutlined, PauseCircleOutlined, FileOutlined, SendOutlined, DeleteOutlined, DoubleRightOutlined, RedoOutlined, SmallDashOutlined } from '@ant-design/icons';
import axios from 'axios'
import { copyArr, Myreplace } from '../../utils/func'
import { message, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Space, Table, Tag, Modal, Tooltip, Button } from 'antd';
import head1 from '../../assests/images/head1.png'
import head2 from '../../assests/images/head2.png'
import { v4 as uuidv4 } from "uuid"
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, github, monokai, tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import URL from '../../env.js'
// import { prism, dark, coy, funky, okaidia, solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
// SyntaxHighlighter.supportedLanguages("sql", sql);
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


export default function RightMain({ setDbDisabled, setUploadAndRefresh, setName, current, setDeleteNumber, deleteNumber, list, addText, setCurrent, setAddFirstChat, dataSourceId, setRefresh, refresh }) {
    // [[{ who: 'ai', content: 'page1你好' }, { who: 'people', content: 'page1你好3' }], [{ who: 'ai', content: 'page2你好' }, { who: 'people', content: 'page2你好3' }]]
    const [chats, setChats] = useState([])
    const navigate = useNavigate();
    const [myCurrent, setMyCurrent] = useState(0)
    const peopleInput = useRef()
    const main = useRef()
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const [text1, setText] = useState([]);
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
        accept: '.xlsx,.xls,.csv',
        onChange(info) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`, 1);
                setUploadAndRefresh(true)
            } else if (info.file.status === 'error') {
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
    //历史记录
    useEffect(() => {
        let Chats = JSON.parse(localStorage.getItem('chats'))
        if (Chats && Chats.length !== 0) {
            setChats(Chats)
            setText(JSON.parse(localStorage.getItem('text')))
        }
    }, [])
    useEffect(() => {
        console.log(chats, 'Chats');
        localStorage.setItem('chats', JSON.stringify(chats))
        // localStorage.setItem('text', JSON.stringify(text))
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
            console.log('?????');
            let newChats = []
            let newText = []
            setChats(newChats)
            setText(newText)
            setRefresh(false)
        }
    }, [refresh])
    //执行SQL
    // const jsonData = ["Ok,here's an example SQL statement to create a basic table in a relational database:", 'To create a basic table in a relational database, you could use a SQL statement like this:', 'If you need to set up a basic table in a relational database, the following SQL statement can be used:', 'The following SQL statement is an example of how to create a simple table in a relational database:', 'When it comes to creating a basic table in a relational database, you might use something like the following SQL statement:'];
    // useEffect(() => {
    //     if (current < 0) {
    //         let current = 0
    //         if (text[current] && text[current].length !== 0) {
    //             const intervalId = setInterval(() => {
    //                 const char = jsonData[text[current].length % 5].charAt(text[current][text[current].length - 1].length);
    //                 if (char) {
    //                     let tempText = copyArr(text)
    //                     tempText[current][tempText[current].length - 1] += char
    //                     setText(tempText);
    //                 }
    //             }, 100);
    //             return () => clearInterval(intervalId);
    //         }
    //     } else {
    //         if (text[current] && text[current].length !== 0) {
    //             const intervalId = setInterval(() => {
    //                 const char = jsonData[text[current].length % 5].charAt(text[current][text[current].length - 1].length);
    //                 if (char) {
    //                     let tempText = copyArr(text)
    //                     tempText[current][tempText[current].length - 1] += char
    //                     setText(tempText);
    //                 }
    //             }, 100);
    //             return () => clearInterval(intervalId);
    //         }
    //     }

    // }, [text]);
    // const [tableData, setTableData] = useState({ columns: [], rows: [] });
    //执行SQL
    const execute = (i, sql) => {
        sql = 'SELECT' + sql.split('SELECT')[1];
        // fetch('${URL}/api/db/query', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         "Authorization": token
        //     },
        //     body: JSON.stringify({
        //         data_source_id: dataSourceId,
        //         query: sql
        //     })
        // }).then(response => {
        //     let isFirstChunk = true;
        //     const streamReader = response.body.getReader();
        //     let dataBuffer = '';
        //     let rowsData = []
        //     return streamReader.read().then(function processResult(result) {
        //         if (result.done) {
        //             console.log('Server closed the connection');
        //             return;
        //         }
        //         // 如果是第一块数据，则需要将其作为表头处理
        //         if (isFirstChunk) {
        //             dataBuffer += new TextDecoder("utf-8").decode(result.value);
        //             const [columns, ...rows] = dataBuffer.split('\n');
        //             setTableData({
        //                 columns: columns.split(','),
        //                 rows: rows.filter(row => row !== '').map(row => row.split(','))
        //             });
        //             isFirstChunk = false;
        //         } else {
        //             dataBuffer += '\n' + new TextDecoder("utf-8").decode(result.value);
        //             rowsData = dataBuffer.split('\n');
        //             if (rowsData[rowsData.length - 1] === '') {
        //                 rowsData.splice(-1, 1);
        //             }
        //             setTableData(prevData => ({
        //                 ...prevData,
        //                 rows: prevData.rows.concat(rowsData.map(row => row.split(',')))
        //             }));
        //         }
        //         dataBuffer = rowsData.pop() || '';
        //         return streamReader.read().then(processResult);
        //     });
        // }).catch(error => console.error('Error occurred:', error))
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'POST',
            data: {
                dbname: dataSourceId,
                query: sql,
                userId
            },
            url: `${URL}/api/db/query`,
        }).then(res => {
            if (res.data.code === 200) {
                let columns = []
                let data = []
                res.data.data.columns.map((v, i) => {
                    columns.push({ title: v, dataIndex: v, key: v })
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
        }).catch((e) => message.warning(e.response.data.data || e.response.data.msg))
    }
    //重新生成SQL
    const reProduct = (i) => {
        setShowStopBtn(true)
        sessionStorage.setItem('show', 'reshow')
        const chatId = JSON.parse(localStorage.getItem('chat'))[current].chatId
        let newChats = copyArr(chats)
        newChats[current][i] = { who: 'ai' }
        setChats(newChats)
        let value = newChats[current][i - 1].content
        // let conversationId = i - 2 < 0 ? '' : newChats[current][i - 2].conversationId || ''
        // let parentId = i - 2 < 0 ? '' : newChats[current][i - 2].parentId || ''
        fetch(`${URL}/api/chat/query?question=${value}&db=${dataSourceId}&userId=${userId}&chatId=${chatId}&`, {
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
                        if (result.done) {
                            setShowStopBtn(false)
                            sessionStorage.setItem('show', 'finishreshow')
                            return;
                        }
                        let text = new TextDecoder("utf-8").decode(result.value).replace(/data:/g, "").replace(/SQL/g, "").replace(/```/g, "").replace(/sql/g, "").replace(/\n/g, "")
                        let newChats3 = copyArr(newChats)
                        if (text) {
                            if (text.includes('message') && text.includes('messageType')) {
                                let count = text.split('}').length
                                if (count === 2) {
                                    let newText = Myreplace(text.split(',"messageType"')[0], ['{', '}', '"', ':', 'message', 'messageType', '\n\r', '[\n\r]', '\n', 'endtrue'])
                                    newText = newText.replace(/\\n/g, ' ')
                                    if (newText !== ',') {
                                        if (newChats3[current][i].content) {
                                            newChats3[current][i].content += newText
                                        } else {
                                            newChats3[current][i].content = newText
                                        }
                                    }

                                } else {
                                    for (let a = 0; a < count; a++) {
                                        let newText = Myreplace(text.split('}')[a].split(',"messageType"')[0], ['{', '}', '"', ':', 'message', 'messageType', '\n\r', '[\n\r]', '\n', 'endtrue'])
                                        newText = newText.replace(/\\n/g, ' ')
                                        if (newText !== ',') {

                                            if (newChats3[current][i].content) {
                                                newChats3[current][i].content += newText
                                            } else {
                                                newChats3[current][i].content = newText
                                            }
                                        }
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

                        // if (text.includes('"')) {
                        //     console.log('报错了');
                        //     newChats3[current][i].content = text.includes('data') ? text.split('"data":"')[1] : text.split('"msg":"')[1].replace(/"/g, "").replace(/}/g, "")
                        // } else {
                        //     if (newChats3[current][i].content) {
                        //         newChats3[current][i].content += text
                        //     } else {
                        //         newChats3[current][i].content = text
                        //     }
                        // }

                        // setChats(newChats3)
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
    //清空一个
    const RefreshOne = () => {
        let newChats = copyArr(chats)
        // let newText = copyArr(text)
        newChats[current] = []
        // newText[current] = []
        setChats(newChats)
        // setText(newText)
    }
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
                // let Text = copyArr(text)
                // Text.push([''])
                // setText(Text)
                setChats(newChats)
                fetch(`${URL}/api/chat/query?question=${value}&db=${dataSourceId}&userId=${userId}&chatId=${chatId}&`, {
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
                            let length = newChats2.length
                            // newChats2[length - 1][1].conversationId = response.headers.conversationid || ''
                            // newChats2[length - 1][1].parentId = response.headers.parentid || ''
                            setChats(newChats2)
                            const streamReader = response.body.getReader();
                            streamReader.read().then(function processResult(result) {
                                if (result.done) {
                                    sessionStorage.setItem('show', 'finishshow')
                                    setShowStopBtn(false)
                                    return;
                                }
                                let text = new TextDecoder("utf-8").decode(result.value).replace(/data:/g, "").replace(/SQL/g, "").replace(/```/g, "").replace(/sql/g, "").replace(/\n/g, "")
                                let newChats3 = copyArr(newChats2)
                                if (text) {
                                    if (text.includes('message') && text.includes('messageType')) {
                                        let count = text.split('}').length
                                        if (count === 2) {
                                            let newText = Myreplace(text.split(',"messageType"')[0], ['{', '}', '"', ':', 'message', 'messageType', '\n\r', '[\n\r]', '\n', 'endtrue'])

                                            newText = newText.replace(/\\n/g, ' ')
                                            if (newText !== ',') {

                                                if (newChats3[newChats3.length - 1][1].content) {
                                                    newChats3[newChats3.length - 1][1].content += newText
                                                } else {
                                                    newChats3[newChats3.length - 1][1].content = newText
                                                }
                                            }
                                        } else {
                                            for (let i = 0; i < count; i++) {
                                                let newText = Myreplace(text.split('}')[i].split(',"messageType"')[0], ['{', '}', '"', ':', 'message', 'messageType', '\n\r', '[\n\r]', '\n', 'endtrue'])
                                                newText = newText.replace(/\\n/g, ' ')
                                                if (newText !== ',') {
                                                    if (newChats3[newChats3.length - 1][1].content) {
                                                        newChats3[newChats3.length - 1][1].content += newText
                                                    } else {
                                                        newChats3[newChats3.length - 1][1].content = newText
                                                    }
                                                }

                                            }
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
                // axios({
                //     headers: {
                //         'Content-Type': 'application/json',
                //         "Authorization": token
                //     },
                //     method: 'POST',
                //     data: {
                //         prompt: value,
                //         dbId: dataSourceId,
                //         userId,
                //         conversationId: '',
                //         parentId: ''
                //     },
                //     url: `${URL}/api/chat/query`,
                // }).then(res => {
                //     if (res.data.code === 200) {
                //         console.log(res);
                //         let newChats2 = copyArr(newChats)
                //         let length = newChats2.length
                //         newChats2[current][length].conversationId = res.headers.conversationid || ''
                //         newChats2[current][length].parentId = res.headers.parentid || ''
                //         newChats2[current][length].content = res.data.data.answers || ''
                //         setChats(newChats2)
                //     } else {
                //         message.warning(res.data.data || res.data.msg)
                //     }
                // }).catch(e => {
                //     console.log(e, 'e');
                //     if (e.response.status === 503) {
                //         message.warning(e.message || e.response.data.error || "can't find the result")
                //         // message.warning('token过期，请重新登陆');
                //         // navigate('/login')
                //     }
                //     else {
                //         message.warning(e.message || e.response.data.error || "can't find the result")
                //     }

                // })
                // ; navigate('/login') 
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
                // let Text = copyArr(text)
                // Text[current] ? Text[current].push('') : Text[current] = ['']
                // setText(Text)
                setChats(newChats1)
                // let length = newChats[current].length
                // let conversationId = newChats[current][length - 2] ? newChats[current][length - 2].conversationId || '' : ''
                // let parentId = newChats[current][length - 2] ? newChats[current][length - 2].parentId || '' : ''
                fetch(`${URL}/api/chat/query?question=${value}&db=${dataSourceId}&userId=${userId}&chatId=${chatId}&`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token
                    },
                    signal: signal
                })
                    .then(response => {
                        // 使用 ReadableStream API 解析事件流数据并更新 state
                        // let newChats2 = copyArr(newChats1)
                        // let length = newChats2[current].length
                        // newChats2[current][length - 1].conversationId = response.headers.conversationid || ''
                        // newChats2[current][length - 1].parentId = response.headers.parentid || ''
                        // setChats(newChats2)
                        if (sessionStorage.getItem('show') === judge) {
                            const streamReader = response.body.getReader();
                            streamReader.read().then(function processResult(result) {
                                if (result.done) {
                                    sessionStorage.setItem('show', 'finishshow')
                                    setShowStopBtn(false)
                                    return;
                                }
                                let text = new TextDecoder("utf-8").decode(result.value).replace(/data:/g, "").replace(/SQL/g, "").replace(/```/g, "").replace(/sql/g, "").replace(/\n/g, "")
                                let newChats3 = copyArr(newChats1)
                                let length = newChats3[current].length
                                if (text) {
                                    if (text.includes('message') && text.includes('messageType')) {
                                        let count = text.split('}').length
                                        if (count === 2) {
                                            let newText = Myreplace(text.split(',"messageType"')[0], ['{', '}', '"', ':', 'message', 'messageType', '\n\r', '[\n\r]', '\n', 'endtrue'])
                                            newText = newText.replace(/\\n/g, ' ')
                                            if (newText !== ',') {
                                                if (newChats3[current][length - 1].content) {
                                                    newChats3[current][length - 1].content += newText
                                                } else {
                                                    newChats3[current][length - 1].content = newText
                                                }
                                            }

                                        } else {
                                            for (let i = 0; i < count; i++) {
                                                let newText = Myreplace(text.split('}')[i].split(',"messageType"')[0], ['{', '}', '"', ':', 'message', 'messageType', '\n\r', '[\n\r]', '\n', 'endtrue'])
                                                newText = newText.replace(/\\n/g, ' ')
                                                if (newText !== ',') {
                                                    if (newChats3[current][length - 1].content) {
                                                        newChats3[current][length - 1].content += newText
                                                    } else {
                                                        newChats3[current][length - 1].content = newText
                                                    }
                                                }
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
                                // if (text.includes('"')) {
                                //     console.log('报错了');
                                //     newChats3[current][length - 1].content = text.includes('data') ? text.split('"data":"')[1] : text.split('"msg":"')[1].replace(/"/g, "").replace(/}/g, "")
                                // } else {
                                //     console.log(text, 'text');
                                //     if (newChats3[current][length - 1].content) {
                                //         newChats3[current][length - 1].content += text
                                //     } else {
                                //         newChats3[current][length - 1].content = text
                                //     }
                                // }
                                // setChats(newChats3)
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
                // axios({
                //     headers: {
                //         'Content-Type': 'application/json',
                //         "Authorization": token
                //     },
                //     method: 'POST',
                //     data: {
                //         prompt: value,
                //         dbId: dataSourceId,
                //         userId,
                //         conversationId: conversationId,
                //         parentId
                //     },
                //     responseType: 'text/event-stream',
                //     url: `${URL}/api/chat/query`,
                // }).then(res => {
                //     console.log(res);
                //     if (res.status === 200) {
                //         console.log(res, 'chat');
                //         let sql = parseString(res.data)
                //         let newChats2 = copyArr(newChats1)
                //         let length = newChats2[current].length
                //         newChats2[current][length - 1].content = sql || ''
                //         newChats2[current][length - 1].conversationId = res.headers.conversationid || ''
                //         newChats2[current][length - 1].parentId = res.headers.parentid || ''
                //         setChats(newChats2)
                //     } else {
                //         message.warning(res.data.data || res.data.msg)
                //     }
                // }).catch(e => {
                //     console.log(e, 'e');
                //     if (e.response.status === 503) {
                //         message.warning(e.message || e.response.data.error || "can't find the result")
                //     }
                //     else {
                //         message.warning(e.message || e.response.data.error || "can't find the result")
                //     }

                // })
            }
        }
    }
    const addNewChat = () => {
        let newChats = copyArr(chats)
        newChats.push([])
        setChats(newChats)
        // let newText = copyArr(text)
        // newText.push([])
        // setText(newText)
    }
    const DeleteChat = (index) => {
        let newChats = []
        let newText = []
        for (let i = 0; i < chats.length; i++) {
            console.log(i, index, newChats);
            if (i !== index) {
                let temp = copyArr(chats[i])
                newChats.push(temp)
                // let temp1 = copyArr(text[i])
                // newText.push(temp1)
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
                dbname: dataSourceId,
                query, filetype, userId
            },
            responseType: 'text/csv',
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
                const url = URL.createObjectURL(blob);
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
            setTimeout(() => {
                console.log(1);
                main.current.scroll({
                    top: 1000000000,
                    behavior: 'smooth'
                });
            }, 1)

        }
    }, [chats])
    useEffect(() => {
        if (deleteNumber >= 0) {
            DeleteChat(deleteNumber)
            setDeleteNumber(-1)
        }
    }, [deleteNumber])
    useEffect(() => {
        if (list >= chats.length) {
            addNewChat()
        }
    }, [list, current])
    useEffect(() => {
        if (addText) {
            peopleInput.current.value += addText
        }
    }, [addText])
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };
    return (
        <div className='RightMain '>
            <Modal title="清空对话" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>是否清空对话？</p>
            </Modal>
            <div ref={main} className='RightMain-main '>
                <ul>
                    {chats[myCurrent]?.map((v, i) => {
                        return (v.who === 'ai' ? <li key={i} className='RightMain-chatli RightMain-aichat'><img className='RightMain-aichat-head' src={head2} alt="" /><div className='RightMain-aichat-content'>
                            {/* <div className='RightMain-aichat-content-start'>{text[myCurrent] ? text[myCurrent][(i - 1) / 2] : ''}</div> */}
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
                                {i === chats[myCurrent].length - 1 ? <div className='RightMain-aichat-content-tool'><Tooltip placement="rightTop" title={<div >执行SQL</div>}><DoubleRightOutlined onClick={() => execute(i, v.content)} /></Tooltip><Tooltip placement="rightTop" title='重新生成SQL'><RedoOutlined onClick={() => reProduct(i)} /></Tooltip></div> : ''}</div>
                            {v.table && v.table[0] ? <><Table tableLayout='auto' columns={v.table[0]} dataSource={v.table[1]} /><Tooltip color='white' title={<ul style={{ color: 'black' }} className='RightMain-aichat-content-download'><li onClick={() => DownloadFile(v.content, 'csv')}><FileOutlined />&nbsp; Download as CSV File</li><li onClick={() => DownloadFile(v.content, 'xlsx')}><FileOutlined />&nbsp; Download as Excel File</li></ul>}><SmallDashOutlined className='RightMain-aichat-content-downloadIcon' /></Tooltip> </> : ''}
                        </div></li> :
                            <li key={i} className='RightMain-chatli RightMain-peoplechat'><div className='RightMain-peoplechat-content'>{v.content}</div><img src={head1} alt="" className='RightMain-peoplechat-head' /></li>)

                    })}
                </ul>
                {/* <table style={{}}>
                    <thead>
                        <tr>
                            {tableData.columns.map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table> */}
            </div>
            <div className='RightMain-bottom'>
                {showStopBtn ?
                    <div className='RightMain-bottom-stopBtn'><Button onClick={stopResponding} className='RightMain-bottom-stopButton' style={{ background: 'rgb(242, 201, 125)!important' }}><PauseCircleOutlined style={{ color: 'white' }} />  Stop Responding</Button></div>
                    : ''}
                <DeleteOutlined onClick={showModal} className='RightMain-bottom-delete' /> <Upload {...props}>
                    <Button className='RightMain-bottom-upload' icon={<UploadOutlined />}></Button>
                </Upload>
                <div className='input'><input placeholder='Ask anything about your Database!' disabled={showStopBtn} onKeyDown={handleKeyDown} ref={peopleInput} type="text" /><SendOutlined onClick={addPeoplechat} style={{ marginLeft: "-40px" }} /></div></div>
        </div>
    )
}
