import React, { useEffect, useState, useRef, useMemo } from 'react'
import { LinkOutlined, DoubleRightOutlined, SolutionOutlined, CommentOutlined, RollbackOutlined, EditOutlined, DeleteOutlined, TableOutlined, SettingOutlined, LogoutOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import userHead from '../../assests/images/head1.png'
import { TreeSelect, Input, Tree, message, Modal, Form, Button, Select, Radio } from 'antd';
import { v4 as uuidv4 } from "uuid"
import axios from 'axios'
import './index.scss'
import { copyArr } from '../../utils/func'
import URL from '../../env.js'
import RemoteDB from './RemoteDB'
const { Search } = Input;
const { DirectoryTree } = Tree;
const { Option } = Select;


const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};
export default function LeftSidebar({ setColorTheme, setChangeModel, changeModel, setLock, dbDisabled, uploadAndRefresh, setUploadAndRefresh, setAddFirstChat, current, name, setName, setCurrent, setDeleteNumber, list, setList, setAddText, addFirstChat, setDataSourceId, setRefresh }) {
    const [chat, setChat] = useState([])
    const navigate = useNavigate();
    const [heightChange, setHeightChange] = useState(0)
    // const [hide, setHide] = useState(true)
    const [repair, setRepair] = useState([])
    const [treeData, setTreeData] = useState([])
    const [dbValue, setDbValue] = useState();
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const line = useRef()
    const [defaultData, setDefaultData] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [theme, setTheme] = useState('light')
    const [resetPassword, setResetPassword] = useState(false)
    const [canSendCode, setCanSendCode] = useState([true, 30])
    const [firstTreeName, setFirstTreeName] = useState('')
    const [deleteFlag, setDeleteFlag] = useState(false)
    const [dbType, setDbType] = useState(1);
    const [links, setLinks] = useState([])
    const [isChooseLink, setIsChooseLink] = useState(false)
    //监听dbtype变化获取db type=3是远程库第一次刷新
    const dbTypeChange = (e, type) => {
        let dbType = e.target ? e.target.value : e
        setDbType(dbType);
        if (dbType === 3) {
            localStorage.setItem('dbType', dbType)
            let flag = false
            if (chat[current] && chat[current].save && type !== 1) {//type===1为选择会话
                addNewChat()
                flag = true
            }
            if (type !== 3) {
                getLinks().then(data => {
                    if (!chat[current].save || flag) {
                        setIsChooseLink(false)
                    } else {//选择了其它已保存的远程数据源的会话
                        setIsChooseLink(true)
                        console.log(data, chat[current].connectId);
                        let linkData = data.filter(v => v.connectId === chat[current].connectId);
                        if (linkData[0]) {
                            handleChooseLink(linkData[0], chat[current].db.db)
                        }
                    }
                })
            }

        } else {
            localStorage.setItem('dbType', dbType)
            localStorage.removeItem('connectId')
            if (type === 1) {
                getDBTreeData(3)
            } else if (type === 2) {
                getDBTreeData(4)
            } else {
                getDBTreeData(1)

            }
        }
    };
    //获取远程数据源
    const getLinks = () => {
        return new Promise((resolve, reject) => {
            axios({
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                method: 'GET',
                url: `${URL}/api/db/connect/getConnections?userId=${userId}`,
            })
                .then(response => {
                    if (response.data.code === 200) {
                        let data = response.data.data;
                        setLinks(data);
                        resolve(data); // 将数据传递给 Promise 的解析函数
                    } else {
                        message.success(response.data.data || response.data.msg);
                        reject(response.data.data || response.data.msg); // 将错误信息传递给 Promise 的拒绝函数
                    }
                })
                .catch(error => {
                    reject(error); // 将错误信息传递给 Promise 的拒绝函数
                });
        });
    };
    //删除远程数据源
    const deleteLink = (connectId) => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'DELETE',
            url: `${URL}/api/db/connect/delete?userId=${userId}&connectId=${connectId}`,
        }).then(res => {
            if (res.data.code === 200) {
                // getLinks()
                init()
            } else {
                message.success(res.data.data || res.data.msg)
            }
        }).catch(e => { console.log(e); })

    }
    //选择远程数据源
    const handleChooseLink = (linkdata, initDB) => {
        setIsChooseLink(true)
        localStorage.setItem('connectId', linkdata.connectId)
        let db = linkdata.dblist.split(',')
        let treeData = []
        db.map((v, i) => 
            treeData.push({
                title: v,
                value: v + i + Math.random() * 1000,
                db: v
            })
        )
        let first = initDB ? initDB : db[0]
        setDbValue(first)
        setTreeData(treeData)
        getTableData(first)
        localStorage.setItem('db', JSON.stringify({ db: first, title: first }))
        setDataSourceId(first)
        setFirstTreeName(first)

    }
    //重新选择数据源
    const handleBack = () => {
        setIsChooseLink(false)
        if (chat[current].save) {
            addNewChat()
        }
    }
    //选择会话
    const handleSelete = (i) => {
        if (chat[i].dbType === 3) {
            setIsChooseLink(true)
        }
        localStorage.setItem('model', chat[i].modelType)
        let add = changeModel.add
        setChangeModel({ type: chat[i].modelType, add })
        let lis = document.querySelectorAll('.LeftSidebar-chats-Li')
        for (let i = 0; i < lis.length; i++) {
            lis[i].className = 'LeftSidebar-chats-Li'
        }
        let li = lis[i]
        if (li) {
            li.className += ' LeftSidebar-chats-seletedLi'
        }
    }
    //右侧命名会话
    useEffect(() => {
        if (name && name.value) {
            let current = parseInt(localStorage.getItem('current'))
            let modelType = parseInt(localStorage.getItem('model')) || 2
            let dbType = parseInt(localStorage.getItem('dbType'))
            let db = JSON.parse(localStorage.getItem("db"))
            let connectId = chat[current].connectId || localStorage.getItem('connectId')
            axios({
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                method: 'POST',
                url: `${URL}/api/chat/${chat[current].save ? 'updateinfo' : 'saveinfo'}`,
                data: {
                    connectId: connectId, dbType, modelType, userId, chatId: name.chatId || chat[current].chatId, title: name.value || chat[current].name, dbName: db.db
                }
            }).then(res => {
                if (res.data.code === 200) {
                    let newChats = copyArr(chat)
                    newChats[current].name = name.value || ''
                    if (name.chatId) {
                        newChats[current].chatId = name.chatId
                    }
                    newChats[current].db = name.db
                    newChats[current].save = true
                    newChats[current].modelType = modelType || 2
                    newChats[current].dbType = dbType || 1
                    newChats[current].connectId = connectId
                    setName('')
                    setChat(newChats)
                } else {
                    message.success(res.data.data || res.data.msg)
                }
            }).catch(e => { })

        }
    }, [name])
    //历史记录
    useEffect(() => {
        init()

    }, [])

    const getUserInfo = () => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'GET',
            url: `${URL}/api/userinfo/details?userId=${localStorage.getItem('userId')}`,
        }).then(res => {
            if (res.data.code === 200) {
                let username = res.data.data.username
                let email = res.data.data.email
                let phone = res.data.data.phone
                let userInfo = [username, email, phone]
                setUserInfo(userInfo)
            } else {
                message.warning(res.data.data || res.data.msg)
            }
        })
    }
    //存localstorage
    useEffect(() => {
        localStorage.setItem('chat', JSON.stringify(chat))
        localStorage.setItem('theme', theme)
        setColorTheme(theme)
    }, [chat, theme])
    //Model1 删除全部
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const showModal1 = () => {
        setIsModalOpen1(true);
    };
    const handleOk1 = () => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'GET',
            url: `${URL}/api/chat/clearinfo?userId=${userId}`,
        }).then(res => {
            if (res.data.code === 200) {
                let newChat = []
                setChat(newChat)
                setCurrent(-1)
                setList(-1)
                setRefresh(true)
                setIsModalOpen1(false);
            } else {
                message.warning(res.data.data || res.data.msg)
            }
        })
    };
    const handleCancel1 = () => {
        setIsModalOpen1(false);
    };
    //Model2 用户信息修改
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [userInfo, setUserInfo] = useState([])
    const showModal2 = () => {
        setIsModalOpen2(true);
    };

    const handleCancel2 = () => {
        setIsModalOpen2(false);

    }
    const onFinishUserInfo = ({ phone, username, email, password, emailCode }) => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'POST',
            data: {
                userId: localStorage.getItem('userId'),
                username,
                phone,
                email: userInfo[1],
                password, emailCode
            },
            url: `${URL}/api/userinfo/update`,
        }).then(res => {
            if (res.data.code != 200) {
                message.success(res.data.data || res.data.msg)
            }
        }).catch(e => { })
    }
    const Chinese = { title: '个人信息', username: '用户名', email: '邮箱*', phone: '手机号码', language: '语言', save: '保存', chinese: '简体中文', english: '英文', choose: '选择语言', password: '密码' }
    const English = { title: 'User Information', username: 'Username', email: 'Email*', phone: 'Phone-number', language: 'Language', save: 'Save', chinese: 'Chinese', english: 'English', choose: 'choose language', password: 'Password' }
    const [language, setLanguage] = useState(Chinese)
    const onGenderChange = (value) => {
        switch (value) {
            case 'Chinese':
                setLanguage(Chinese);
                break;
            case 'English':
                setLanguage(English);
                break;
            default:
        }
    };
    //重置密码发送验证码
    useEffect(() => {
        let timerId
        if (canSendCode[1] > 0 && !canSendCode[0]) {
            timerId = setTimeout(() => {
                let count = canSendCode[1] - 1
                let temp = [false, count]
                setCanSendCode(temp);
            }, 1000);

        } else if (!canSendCode[0]) {
            setCanSendCode([true, 0])
        }
        return () => clearTimeout(timerId);

    }, [canSendCode]);
    const sendEmail = () => {
        if (userInfo[1]) {
            setCanSendCode([false, 30])
            axios({
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                data: {
                    email: userInfo[1],
                    type: '2'
                },
                url: `${URL}/api/user/send`,
            }).then(res => {
                if (res.data.code === 200) {
                    message.success(res.data.data || res.data.msg)
                } else {
                    message.warning(res.data.data | res.data.msg)
                }
            })
        } else {
            message.warning('个人信息获取失败！请重新登陆')
        }
    }
    const PasswordInput = (e) => {
        let value = e.target.value.trim()
        if (value) {
            setResetPassword(true)
        } else {
            setResetPassword(false)
        }
    }
    //Model3 远程库连接
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const showModal3 = () => {
        setIsModalOpen3(true);
    };
    const handleCancel3 = () => {
        setIsModalOpen3(false);

    }
    //修改主题颜色
    const changeTheme = () => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.style.setProperty(`--primary-color`, 'rgb(24, 24, 28)');
            root.style.setProperty(`--primary-color1`, 'rgb(46, 60, 72)');
            root.style.setProperty(`--secondary-color`, '#86CBFA');
            root.style.setProperty(`--secondary-color1`, 'gray');
            root.style.setProperty(`--third-color`, 'white');
            root.style.setProperty(`--third-color1`, 'rgba(255,255,255,.2)');
            root.style.setProperty(`--third-color2`, 'rgba(255,255,255,.6)');
            setTheme('dark')
        } else {
            root.style.setProperty(`--primary-color`, 'white');
            root.style.setProperty(`--primary-color1`, 'rgb(248, 248, 255)');
            root.style.setProperty(`--secondary-color`, '#86CBFA');
            root.style.setProperty(`--secondary-color1`, 'rgba(134, 203, 250, .2)');
            root.style.setProperty(`--third-color`, 'rgb(36, 36, 36)');
            root.style.setProperty(`--third-color1`, 'rgba(36, 36, 36,.2)');
            root.style.setProperty(`--third-color2`, 'rgba(36, 36, 36,.6)');

            setTheme('light')
        }
    }
    //退出登录
    const logout = () => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'GET',
            url: `${URL}/api/user/logout`,
        }).then(res => {
        }).catch(e => { })
        navigate('/login')
        localStorage.clear()
    }
    //新增会话
    const addNewChat = () => {
        // setHide(false)
        if (chat.length <= 19) {
            let chats = copyArr(chat)
            const chatId = uuidv4();
            chats.unshift({ name: 'New chat', chatId })
            setChat(chats)
            setList(list + 1)
            setCurrent(0)
        } else {
            message.warning('会话个数受到限制')
        }

    }
    //current改变切换会话和db
    useEffect(() => {
        if (current >= 0 || deleteFlag) {
            setDeleteFlag(false)
            handleSelete(current)
            if (chat[current].dbType === dbType || !chat[current].dbType) {
                if (dbType !== 3) {
                    treeData.map((v, i) => {
                        if (chat[current].db && chat[current].db.db === v.db) {
                            setDbValue(v.title)
                            getTableData(v.db)
                            setDataSourceId(v.db)
                            localStorage.setItem('db', JSON.stringify(chat[current].db))
                        }
                    })
                } else {
                    let db = chat[current].db
                    getLinks().then(data => {
                        let linkData = data.filter(v => v.connectId === chat[current].connectId);
                        handleChooseLink(linkData[0], db.db)
                    })
                }

            } else {
                dbTypeChange(chat[current].dbType, 1)
            }

        }
    }, [current, deleteFlag])
    //修改名字
    const changeReapir = (i) => {
        let repairs = copyArr(repair)
        repairs[i] = true
        setRepair(repairs)
    }
    const handleRepair = (e, i, node) => {
        if (e.keyCode === 13) {
            let repairs = copyArr(repair)
            repairs[i] = false
            setRepair(repairs)
            let chats = copyArr(chat)
            chats[i].name = node ? node.target.value : e.target.value
            axios({
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                method: 'POST',
                url: `${URL}/api/chat/updateinfo`,
                data: {
                    userId, chatId: chats[i].chatId, title: chats[i].name, dbName: chats[i].db.db
                }
            }).then(res => {
                if (res.data.code === 200) {
                    setChat(chats)
                } else {
                    message.warning(res.data.data || res.data.msg)
                }

            }).catch(e => { })
        }
    }
    //删除会话
    const deleteChat = (j) => {
        let chats = []
        let i = 0;
        if (chat[j].save) {
            axios({
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                method: 'POST',
                url: `${URL}/api/chat/deleteinfo`,
                data: {
                    userId, chatId: chat[j].chatId
                }
            }).then(res => {
                if (res.data.code === 200) {
                    for (i; i < chat.length; i++) {
                        if (i !== j) {
                            chats.push(chat[i])
                        }
                    }
                    if (j <= current) {
                        if (current - 1 === -1 && list !== 0) {
                            setCurrent(0)
                            setDeleteFlag(true)
                        } else {
                            setCurrent(current - 1)
                        }
                    }
                    setChat(chats)
                    setDeleteNumber(j)
                    setList(list - 1)
                } else {
                    message.warning(res.data.msg)
                }
            }).catch(e => { })
        } else {
            for (i; i < chat.length; i++) {
                if (i !== j) {
                    chats.push(chat[i])
                }
            }
            if (j <= current) {
                if (current - 1 === -1 && list !== 0) {
                    setCurrent(0)
                    setDeleteFlag(true)
                } else {
                    setCurrent(current - 1)
                }
            }
            setChat(chats)
            setDeleteNumber(j)
            setList(list - 1)
        }

    }
    //选择db，判断是否切换
    const handleSelect = (value, node, extra) => {
        if (node.db !== JSON.parse(localStorage.getItem('db')).db) {
            setDataSourceId(node.db)
            setDbValue(node.title)
            getTableData(node.db)
            if (chat[current] && chat[current].save) {
                addNewChat()
            }
            localStorage.setItem('db', JSON.stringify(node))
        }
    }
    //往右边输入框加字
    const onSelect = (value) => {
        setAddText(value.props.children[2])
    }
    //获取每个数据库的行列
    const getTableData = (dbname) => {
        let DBType = parseInt(localStorage.getItem('dbType'))
        let connectId
        if (DBType === 3) {
            connectId = localStorage.getItem('connectId')
        }
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'GET',
            url: `${URL}/api/db/schema?userId=${userId}&dbname=${dbname}&DBType=${DBType}&connectId=${connectId}`,
        }).then(res => {
            if (res.data.code === 200) {
                let data = res.data.data
                let defaultData = []
                let dataList = []
                data.map((v, i) => {
                    let temp = Math.random() * 1000
                    dataList.push({ key: v.tableName + i + temp, title: v.tableName })
                    defaultData.push({
                        title: v.tableName, key: v.tableName + i + temp, value: v.tableName, children: v.tableColumns.map((value, index) => {
                            let temp = Math.random() * 1000
                            dataList.push({ key: value + index + temp, title: value, })
                            return ({ title: value, value, key: value + index + temp })
                        })
                    })
                })
                setDefaultData(defaultData)
                setDataList(dataList)
            } else {
                message.warning(res.data.data || res.data.msg)
            }
        })

    }
    //获取数据库数据 which: 1:手动切换dbtype 2:上传数据库 3:选择不同dbType的会话 4:获取历史记录后第一次
    const getDBTreeData = (which) => {
        let DBType = parseInt(localStorage.getItem('dbType'))
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'GET',
            url: `${URL}/api/db/list?userId=${userId}&DBType=${DBType}`,
        }).then(res => {
            let treeData = []
            if (res.data.code === 200) {
                res.data.data.map((v, i) => {
                    treeData.push({
                        title: v.includes('$') ? v.split('$')[1] : v,
                        value: v + i + Math.random() * 1000,
                        db: v
                    })
                })
                setTreeData(treeData)
                if ((!parseInt(localStorage.getItem('current')) && parseInt(localStorage.getItem('current')) !== 0) || parseInt(localStorage.getItem('current')) === -1 || which === 1) {
                    if (which !== 4) {
                        localStorage.setItem('db', JSON.stringify(treeData[0]))
                        setDbValue(treeData[0].title)
                        getTableData(res.data.data[0])
                        setDataSourceId(treeData[0].db)
                    }
                    setFirstTreeName(treeData[0].title)
                    if (chat[current] && chat[current].save) {
                        addNewChat()
                    }
                }
                if (which === 3) {
                    treeData.map((v, i) => {
                        if (chat[current].db && chat[current].db.db === v.db) {
                            setDbValue(v.title)
                            getTableData(v.db)
                            setDataSourceId(v.db)
                            localStorage.setItem('db', JSON.stringify(chat[current].db))
                        }
                    })
                }
            } else {
                message.warning(res.data.data || res.data.msg)
            }
        })


    }
    //上传后刷新数据库
    useEffect(() => {
        if (uploadAndRefresh) {
            if (parseInt(localStorage.getItem('dbType')) === 2) {
                getDBTreeData(2)
            }
            setUploadAndRefresh(false)
        }
    }, [uploadAndRefresh])
    //中间线 获取db 设置model
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

        //获取用户信息
        getUserInfo()
        //设置model
        localStorage.setItem('model', 2)
        //设置dbType
        localStorage.setItem('dbType', 1)

        //获取数据
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'GET',
            url: `${URL}/api/chat/listinfo?userId=${localStorage.getItem('userId')}`,
        }).then(res => {
            if (res.data.code === 200) {
                let data = res.data.data
                let initChat = []
                data.map((v) => {
                    initChat.unshift({ connectId: v.connectId, dbType: v.dbType, chatId: v.chatId, modelType: v.modelType, save: true, name: v.title, db: { db: v.dbName, title: v.dbName && v.dbName.includes('$') ? v.dbName.split('$')[1] : v.dbName, } })
                })
                setChat(initChat)
                setTheme(localStorage.getItem('theme'))
                if (initChat.length > 0) {
                    localStorage.setItem('dbType', initChat[0].dbType)
                    let db = initChat[0].db
                    localStorage.setItem('db', JSON.stringify(db))
                    setDbValue(db.title)
                    setDataSourceId(db.db)
                    setList(initChat.length - 1)
                    setCurrent(0)
                    if (initChat[0].dbType === 3) {
                        dbTypeChange(initChat[0].dbType, 3)
                        setIsChooseLink(true)
                        getLinks().then(data => {
                            let linkData = data.filter(v => v.connectId === initChat[0].connectId);
                            handleChooseLink(linkData[0], db.db)

                        })
                    } else {
                        dbTypeChange(initChat[0].dbType, 2)
                        getTableData(db.db)
                    }
                } else {
                    //获取dbtree
                    getDBTreeData()
                }
                setLock(false)
            } else {
                message.warning(res.data.data || res.data.msg)
            }
        })

    }


    //树展示
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const onExpand = (newExpandedKeys) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };
    const onChange = (e) => {
        const { value } = e.target;
        const newExpandedKeys = dataList
            .map((item) => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, defaultData);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        setExpandedKeys(newExpandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
    };
    const treeData2 = useMemo(() => {
        const loop = (data) =>
            data.map((item) => {
                const strTitle = item.title;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className="site-tree-search-value">{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{strTitle}</span>
                    );
                if (item.children) {
                    return {
                        title: <div style={{ display: 'flex', justifyContent: 'space-between' }}>{title} <DoubleRightOutlined onClick={() => onSelect(title)} /></div>,
                        key: item.key,
                        children: loop(item.children),
                    };
                }
                return {
                    title: <div style={{ display: 'flex', justifyContent: 'space-between' }}>{title} <DoubleRightOutlined onClick={() => onSelect(title)} /></div>,
                    key: item.key,
                    isLeaf: true,
                };
            });
        return loop(defaultData);
    }, [searchValue, defaultData]);
    //增加第一个会话
    useEffect(() => {
        if (addFirstChat && addFirstChat.value) {
            let modelType = parseInt(localStorage.getItem('model'))
            let dbType = parseInt(localStorage.getItem('dbType'))
            let connectId = dbType === 3 ? localStorage.getItem('connectId') : ''
            axios({
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                method: 'POST',
                url: `${URL}/api/chat/saveinfo`,
                data: {
                    connectId, modelType: modelType || 2, userId, chatId: addFirstChat.chatId, title: addFirstChat.value, dbName: addFirstChat.db.db, dbType
                }
            }).then(res => {
                if (res.data.code === 200) {
                    setList(list + 1)
                    let chats = copyArr(chat)
                    chats.push({ connectId, dbType, modelType: modelType || 2, name: addFirstChat.value, chatId: addFirstChat.chatId, db: addFirstChat.db, save: true })
                    setChat(chats)
                    setCurrent(chats.length - 1)
                    setAddFirstChat('')
                } else {
                    message.warning(res.data.data || res.data.msg)
                }

            }).catch(e => { })

        }
    }, [addFirstChat])

    return (
        <div className='LeftSidebar'>
            {dbDisabled ? <div onClick={() => { message.warning('please wait for the response', 1) }} style={{ position: 'absolute', zIndex: "10", left: 0, top: 0, width: '100%', height: "100vh", background: "rgba(0,0,0,.1)" }}></div> : ''}
            {/* 清空所有对话 */}
            <Modal title="清空所有对话" open={isModalOpen1} onOk={handleOk1} onCancel={handleCancel1}>
                <p>是否清空所有对话？</p>
            </Modal>
            {/* userInfo Modal*/}
            <Modal footer={null} title={<div className='model2-userInfo'><SolutionOutlined />&nbsp; {language.title}</div>} open={isModalOpen2} onCancel={handleCancel2}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinishUserInfo}
                    autoComplete="on"
                >
                    <Form.Item
                        label={language.username}
                        name="username"
                        rules={[
                            {
                                pattern: "^[\\u4e00-\\u9fa5a-zA-Z0-9]{4,12}$",
                                message: '用户名必须为4-12位字母/数字/中文'
                            }
                        ]}
                    >
                        <Input placeholder={userInfo[0]} />
                    </Form.Item>
                    <Form.Item
                        label={language.password}
                        name="password"
                        rules={[
                            {
                                pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$",
                                message: '密码必须包含6-20个大小写字母、数字'

                            }
                        ]}
                    >
                        <Input onChange={PasswordInput} />
                    </Form.Item>
                    {resetPassword ? <Form.Item
                        name="emailCode"
                        label="邮箱验证码"
                        rules={[
                            {
                                required: true,
                                message: '请填写邮箱验证码',
                            },
                        ]}
                    ><div>
                            <Input style={{ width: '100px' }} /><Button disabled={!canSendCode[0]} onClick={sendEmail}>{canSendCode[0] ? '发送邮箱验证码' : canSendCode[1] + 's后重新发送'}</Button>
                        </div>
                    </Form.Item> : ''}
                    <Form.Item
                        name="email"
                        label={language.email}
                    >
                        <Input disabled placeholder={userInfo[1]} />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label={language.phone}
                        rules={[
                            {
                                pattern: "^((13[0-9])|(14[0|5|6|7|9])|(15[0-3])|(15[5-9])|(16[6|7])|(17[2|3|5|6|7|8])|(18[0-9])|(19[1|8|9]))\\d{8}$",
                                message: '手机号应为11位数字'
                            }
                        ]}
                    >
                        <Input
                            placeholder={userInfo[2]}
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="language"
                        label={language.language}
                    >
                        <Select
                            placeholder={language.choose}
                            onChange={onGenderChange}
                            allowClear
                        >
                            <Option value="Chinese">{language.chinese}</Option>
                            <Option value="English">{language.english}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 10,
                            span: 2,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            {language.save}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Create Connection */}
            <Modal title="Create Connection" footer={null} open={isModalOpen3} onCancel={handleCancel3}>
                <RemoteDB getLinks={getLinks} handleCancel3={handleCancel3}></RemoteDB>
            </Modal>
            {/* LeftSidebar-top */}
            <div className='LeftSidebar-top' style={{ height: `calc(40vh + ${heightChange}px)` }}>
                <div onClick={() => addNewChat()} className='LeftSidebar-addNewChat'>+ &nbsp;&nbsp;New chat</div>
                <ul className='LeftSidebar-chats'>
                    {chat.length !== 0 ? chat.map((v, i) => {
                        return (<li className='LeftSidebar-chats-Li' key={i}><CommentOutlined />&nbsp;&nbsp;&nbsp;&nbsp;{repair[i] ? <input type="text" onBlur={(e) => handleRepair({ keyCode: 13 }, i, e)} onKeyDown={(e) => handleRepair(e, i)} style={{ margin: '0' }} className='newChatInput' /> : <div onClick={() => setCurrent(i)} className='LeftSidebar-chats-name'> {v.name}</div>}&nbsp;&nbsp;&nbsp;&nbsp;
                            {v.save ? <EditOutlined onClick={() => changeReapir(i)} /> : ''}&nbsp;&nbsp;&nbsp;&nbsp;<DeleteOutlined onClick={() => deleteChat(i)} /></li>)
                    }) : ''}
                </ul>
                {chat.length === 0 ? '' : <div onClick={showModal1} className='LeftSidebar-top-deteleAll'><DeleteOutlined />&nbsp;&nbsp; Clear conversations</div>}
            </div>
            <div ref={line} className='LeftSidebar-line'></div>
            {/* LeftSidebar-bottom */}
            <div className='LeftSidebar-bottom' style={{ height: `calc(58vh - 75px - ${heightChange}px)` }}>
                <div className='LeftSidebar-bottom-top'>
                    <Radio.Group value={dbType} onChange={dbTypeChange} size='middle'>
                        <Radio.Button value={1}>公共库</Radio.Button>
                        <Radio.Button value={2}>用户库</Radio.Button>
                        <Radio.Button value={3}>远程数据源</Radio.Button>
                    </Radio.Group>
                    {dbType === 3 && !isChooseLink ?
                        <ul className='LeftSidebar-bottom-link'>
                            {links?.map((v, i) => {
                                return (<li key={i} onClick={() => handleChooseLink(v)}><div><LinkOutlined /> {v.title || v.host}</div><DeleteOutlined onClick={(e) => { e.stopPropagation(); deleteLink(v.connectId) }} /></li>)
                            })}
                            <li onClick={showModal3} > + 添加远程数据源</li>
                        </ul>
                        : <> <TreeSelect className='LeftSidebar-bottom-TreeSelect'
                            showSearch
                            size='middle'
                            style={{
                                width: '98%',
                                color: 'white!important',
                                marginLeft: 3

                            }}
                            value={dbValue}
                            dropdownStyle={{
                                maxHeight: 400,
                                overflow: 'auto',
                            }}
                            placeholder={firstTreeName}
                            onSelect={(value, node, extra) => handleSelect(value, node, extra)}
                            treeData={treeData}
                        />
                            <div >
                                <Search
                                    style={{
                                        marginTop: '10px',
                                        width: '98%',
                                        marginBottom: 8,
                                        marginLeft: 3
                                    }}
                                    placeholder="Search"
                                    onChange={onChange}

                                />
                                <DirectoryTree
                                    onExpand={onExpand}
                                    switcherIcon={<TableOutlined />}
                                    showIcon={false}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    treeData={treeData2}
                                />
                            </div>{dbType === 3 ? <div onClick={handleBack} className='LeftSidebar-bottom-back'><RollbackOutlined />&nbsp;&nbsp;Choose other link</div> : ''}</>}

                </div>
                {/* bottom setting */}
                <div className='LeftSidebar-bottom-userInfo'>
                    <img className='LeftSidebar-bottom-head' src={userHead} alt="" />
                    <h1 className='LeftSidebar-bottom-name'>{userInfo[0]}</h1>
                    <SettingOutlined onClick={showModal2}  ></SettingOutlined>
                    <LogoutOutlined onClick={logout} />
                    <BulbOutlined onClick={changeTheme} />
                </div>

            </div>
        </div>
    )
}
