import React, { useEffect, useState, useRef, useMemo } from 'react'
import { DoubleRightOutlined, SolutionOutlined, CommentOutlined, EditOutlined, DeleteOutlined, TableOutlined, SettingOutlined, LogoutOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import userHead from '../../assests/images/head1.png'
import { TreeSelect, Input, Tree, message, Modal, Form, Button, Select } from 'antd';
import { v4 as uuidv4 } from "uuid"
import axios from 'axios'
import './index.scss'
import { copyArr } from '../../utils/func'
import URL from '../../env.js'

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
export default function LeftSidebar({ dbDisabled, uploadAndRefresh, setUploadAndRefresh, setAddFirstChat, current, name, setName, setCurrent, setDeleteNumber, list, setList, setAddText, addFirstChat, setDataSourceId, setRefresh }) {
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
    //选择
    const handleSelete = (i) => {
        let lis = document.querySelectorAll('.LeftSidebar-chats-Li')
        for (let i = 0; i < lis.length; i++) {
            lis[i].className = 'LeftSidebar-chats-Li'
        }
        let li = lis[i]
        if (li) {
            li.className += ' LeftSidebar-chats-seletedLi'
        }
    }
    //命名
    useEffect(() => {
        if (name && name.value) {
            let newChats = copyArr(chat)
            newChats[current].name = name.value || ''
            if (name.chatId) {
                newChats[current].chatId = name.chatId
            }
            if (name.db) {
                newChats[current].db = name.db
            }
            setName('')
            setChat(newChats)
        }
    }, [name])
    //历史记录
    useEffect(() => {
        init()
        let chat = JSON.parse(localStorage.getItem('chat'))
        if (chat && chat.length !== 0) {
            setChat(chat)
            setTheme(localStorage.getItem('theme'))
            let db = chat[parseInt(localStorage.getItem('current'))].db
            setDbValue(db.title)
            getTableData(db.db)
            setFirstTreeName(db.title)
            setDataSourceId(db.db)
            localStorage.setItem('db', JSON.stringify(db))
        }
        //获取个人信息
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
                message.warning(res.data.msg)
            }
        }).catch(e => {
            message.warning('please login again', 1);
            navigate('/login')
        })
    }, [])
    useEffect(() => {
        localStorage.setItem('chat', JSON.stringify(chat))
        localStorage.setItem('theme', theme)
    }, [chat, theme])
    //Model1 删除全部
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const showModal1 = () => {
        setIsModalOpen1(true);
    };
    const handleOk1 = () => {
        let newChat = []
        setChat(newChat)
        setCurrent(-1)
        setList(-1)
        setRefresh(true)
        setIsModalOpen1(false);
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

    };
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
            if (res.data.code === 200) {
                message.success(res.data.data || res.data.msg)
            } else {
                message.warning(res.data.msg)
            }
        }).catch(e => {

            message.warning('Error'); navigate('/login')
        })
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
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
    }
    //新增会话
    const addNewChat = (db) => {
        // setHide(false)
        if (chat.length <= 19) {
            let chats = copyArr(chat)
            const chatId = uuidv4();
            chats.push({ name: 'New chat', chatId, db })
            setChat(chats)
            setList(list + 1)
            setCurrent(chats.length - 1)
        } else {
            message.warning('会话个数受到限制')
        }

    }
    useEffect(() => {
        if (current >= 0 || deleteFlag) {
            setDeleteFlag(false)
            handleSelete(current)
            treeData.map((v, i) => {
                if (chat[current].db && chat[current].db.db === v.db) {
                    setDbValue(v.title)
                    getTableData(v.db)
                    setDataSourceId(v.db)
                    localStorage.setItem('db', JSON.stringify(chat[current].db))
                }
            })
        }
    }, [current, deleteFlag])
    //确认名字
    // const handleConfirmName = (e) => {
    //     if (e.keyCode === 13) {
    //         setHide(true)
    //         let chats = copyArr(chat)
    //         chats.push('new Chat')
    //         setChat(chats)
    //         e.target.value = ''
    //     }
    // }
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
            setChat(chats)
        }
    }
    //删除会话
    const deleteChat = (j) => {
        let chats = []
        let i = 0;
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
    //根据数据库获取行泪资料
    const handleSelect = (value, node, extra) => {
        if (node.db !== JSON.parse(localStorage.getItem('db')).db) {
            setDataSourceId(node.db)
            getTableData(node.db)
            addNewChat(node)
            localStorage.setItem('db', JSON.stringify(node))
        }
    }
    //往右边输入框加字
    const onSelect = (value) => {
        setAddText(value.props.children[2])
    }
    //获取每个数据库的行列
    const getTableData = (dbname) => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'GET',
            url: `${URL}/api/db/schema?userId=${userId}&dbname=${dbname}`,
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
                message.warning(res.data.msg)
            }
        }).catch(e => {

            message.warning('please login again!', 1)
            navigate('/login')
                ;
        })

    }
    //获取数据库数据
    const getDBTreeData = (which) => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'GET',
            url: `${URL}/api/db/list?userId=${userId}`,
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
                if (!parseInt(localStorage.getItem('current')) || parseInt(localStorage.getItem('current')) === -1) {
                    localStorage.setItem('db', JSON.stringify(treeData[0]))
                    getTableData(res.data.data[0])
                    setFirstTreeName(treeData[0].title)
                    setDataSourceId(treeData[0].db)
                }
                if (which === 1) {
                }
            } else {
                message.warning(res.data.msg)
            }

        }).catch(e => {

            message.warning('please login again!', 1);
            navigate('/login')
        })


    }
    //上传后刷新数据库
    useEffect(() => {
        if (uploadAndRefresh) {
            getDBTreeData(1)

            setUploadAndRefresh(false)
        }
    }, [uploadAndRefresh])
    //中间线
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
            // setHide(true)
            setList(list + 1)
            let chats = copyArr(chat)
            chats.push({ name: addFirstChat.value, chatId: addFirstChat.chatId, db: addFirstChat.db })
            setChat(chats)
            setCurrent(chats.length - 1)
            setAddFirstChat('')
        }
    }, [addFirstChat])

    return (
        <div className='LeftSidebar'>
            <Modal title="清空所有对话" open={isModalOpen1} onOk={handleOk1} onCancel={handleCancel1}>
                <p>是否清空所有对话？</p>
            </Modal>
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
            <div className='LeftSidebar-top' style={{ height: `calc(40vh + ${heightChange}px)` }}>
                <div onClick={() => addNewChat(JSON.parse(localStorage.getItem('db')))} className='LeftSidebar-addNewChat'>+ &nbsp;&nbsp;New chat</div>
                <ul className='LeftSidebar-chats'>
                    {chat.length !== 0 ? chat.map((v, i) => {
                        return (<li className='LeftSidebar-chats-Li' key={i}><CommentOutlined />&nbsp;&nbsp;&nbsp;&nbsp;{repair[i] ? <input type="text" onBlur={(e) => handleRepair({ keyCode: 13 }, i, e)} onKeyDown={(e) => handleRepair(e, i)} style={{ margin: '0' }} className='newChatInput' /> : <div onClick={() => setCurrent(i)} className='LeftSidebar-chats-name'> {v.name}</div>}&nbsp;&nbsp;&nbsp;&nbsp;<EditOutlined onClick={() => changeReapir(i)} />&nbsp;&nbsp;&nbsp;&nbsp;<DeleteOutlined onClick={() => deleteChat(i)} /></li>)
                    }) : ''}
                </ul>
                {/* <div className={hide ? 'hidden' : 'newChatInputDiv'}><input onKeyDown={handleConfirmName} type="text" className='newChatInput' placeholder='title of chat' /></div> */}
                {chat.length === 0 ? '' : <div onClick={showModal1} className='LeftSidebar-top-deteleAll'><DeleteOutlined />&nbsp;&nbsp; Clear conversations</div>}
                {/* <div className='LeftSidebar-introduction'>Welcome you to use chatDb,Now you can have a try to add new chat. </div> */}
            </div>
            <div ref={line} className='LeftSidebar-line'></div>
            <div className='LeftSidebar-bottom' style={{ height: `calc(58vh - 75px - ${heightChange}px)` }}>
                <div className='LeftSidebar-bottom-top'>
                    <TreeSelect className='LeftSidebar-bottom-TreeSelect'
                        showSearch
                        size='middle'
                        style={{
                            width: '98%',
                            color: 'white!important'
                        }}
                        value={dbValue}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto',
                        }}
                        disabled={dbDisabled}
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
                    </div>
                    {/* <div className='LeftSidebar-introduction'>You can choose db to get some correspondingly message</div> */}
                </div>
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
