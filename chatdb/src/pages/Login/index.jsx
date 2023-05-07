import React, { useState, useEffect, useRef } from 'react'
import './index.scss'
import { LockOutlined, UserOutlined, RedoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Button, Checkbox, Form, Input, message, Modal, Select, } from 'antd';
import code from '../../assests/images/code.png'
import { copyArr, debounce } from '../../utils/func';
import Logo from '../../assests/images/logo.png'
import { v4 as uuidv4 } from "uuid"
import Cookies from 'js-cookie'
import URL from '../../env.js'

const { Option } = Select;
export default function Login() {

    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [captcha, setCaptcha] = useState([])
    const navigate = useNavigate();
    const [canSendCode, setCanSendCode] = useState([true, 30])
    const [canSendCode1, setCanSendCode1] = useState([true, 30])

    const Email = useRef()
    const Email1 = useRef()

    const resetPassword = (values) => {
        const { password, email, emailCode } = values
        axios({
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            data: {
                email,
                password, emailCode
            },
            url: `${URL}/api/user/reset`,
        }).then(res => {
            if (res.data.code === 200) {
                message.success(res.data.data)
                handleCancel1()
            } else {
                message.warning(res.data.data || res.data.msg || '重置密码失败')
            }
        })
    }
    const showModal = () => {
        setOpen(true);
    };
    const showModal1 = () => {
        setOpen1(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };
    const handleCancel1 = () => {
        setOpen1(false);
    };
    const register = () => {
        showModal()
    }
    useEffect(() => {
        let timerId
        if (canSendCode1[1] > 0 && !canSendCode1[0]) {
            timerId = setTimeout(() => {
                let count = canSendCode1[1] - 1
                let temp = [false, count]
                setCanSendCode1(temp);
            }, 1000);

        } else if (!canSendCode1[0]) {
            setCanSendCode1([true, 0])
        }
        return () => clearTimeout(timerId);

    }, [canSendCode1]);
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
    const sendEmail = (i) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let email = i === '1' ? Email.current.input.value : Email1.current.input.value
        if (email && regex.test(email)) {
            //判断邮箱是否注册
            axios({
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                url: `${URL}/api/user/isExists?email=${email}`,
            }).then(res => {
                i === '1' ? setCanSendCode([false, 30]) : setCanSendCode1([false, 30])
                if (res.data.code !== 200) {
                    if (i === '1') {
                        message.warning(res.data.data)
                    } else {
                        axios({
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            method: 'POST',
                            data: {
                                email,
                                type: i
                            },
                            url: `${URL}/api/user/send`,
                        }).then(res => {
                            if (res.data.code === 200) {
                                message.success(res.data.data)
                            } else {
                                message.warning(res.data.msg)
                            }
                        })
                    }

                } else {
                    if (i === '1') {
                        axios({
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            method: 'POST',
                            data: {
                                email,
                                type: i
                            },
                            url: `${URL}/api/user/send`,
                        }).then(res => {
                            if (res.data.code === 200) {
                                message.success(res.data.data)
                            } else {
                                message.warning(res.data.msg)
                            }
                        })
                    } else {
                    }

                }
            })
        } else {
            message.warning('Email format is not correct or not common')
        }

    }
    //登录i=1 注册i=0
    const sendCaptcha = (i) => {
        debounce(() => {
            const myUuid = uuidv4();
            axios({
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                responseType: 'arraybuffer',
                url: `${URL}/api/user/captcha?captchaKey=${myUuid}`,
            }).then(res => {
                let imgData = btoa(String.fromCharCode(...new Uint8Array(res.data)));
                let temp = copyArr(captcha)
                temp[i] = imgData
                temp[i + 2] = myUuid
                setCaptcha(temp)
            })
        }, 500)
    }

    const onFinish = (values) => {
        // Dismiss manually and asynchronously
        const { email, password, captchaCode } = values
        axios({
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            data: {
                email,
                password, captchaCode, captchaKey: captcha[3]
            },
            maxBodyLength: Infinity,
            withCredentials: true,
            url: `${URL}/api/user/login`,
        }).then(res => {
            if (res.data.code !== 200) {
                message.warning(res.data.data)
                sendCaptcha(1)
            } else {
                message.success(res.data.msg)
                localStorage.clear()
                localStorage.setItem('token', res.headers.authorization)
                localStorage.setItem('userId', res.headers.userid)
                navigate('/chatdb')
            }
        })
    };
    const onFinishRegister = (values) => {
        const { username, password, email, phone, captchaCode, emailCode, inviteCode } = values

        axios({
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            data: {
                username,
                password, email, phone, emailCode, captchaCode, captchaKey: captcha[2], inviteCode
            },
            url: `${URL}/api/user/register`,
        }).then(res => {
            if (res.data.code !== 200) {
                message.warning(res.data.data)
                sendCaptcha(0)
            } else {
                message.success(res.data.data)
                handleCancel()
            }
        })



    }
    useEffect(() => {
        if (open) {
            sendCaptcha(0)
        } else {
            sendCaptcha(1)
        }

    }, [open])
    return (
        <div className='Login'>
            <Modal
                title="用户注册"
                open={open}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
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
                    onFinish={onFinishRegister}
                    autoComplete="on"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                            {
                                pattern: "^[\\u4e00-\\u9fa5a-zA-Z0-9]{4,12}$",
                                message: '用户名必须为4-12位字母/数字/中文'
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                            {
                                pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$",
                                message: '密码必须包含6-20个大小写字母、数字'

                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            {
                                type: 'email',
                                message: '邮箱格式错误!',
                            },
                            {
                                required: true,
                                message: '请输入您的邮箱!',
                            },
                        ]}
                    >
                        <div style={{ display: 'flex' }}><Input ref={Email} /> <Button disabled={!canSendCode[0]} onClick={() => sendEmail('1')}>{canSendCode[0] ? '发送邮箱验证码' : canSendCode[1] + 's后重新发送'}</Button></div>

                    </Form.Item>
                    <Form.Item
                        name="emailCode"
                        label="请填写邮箱验证码"
                        rules={[
                            {
                                required: true,
                                message: '请填写邮箱验证码',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="captchaCode"
                        label="验证码"
                        rules={[
                            {
                                required: true,
                                message: '请填写图形验证码',
                            },
                        ]}
                    >
                        <div>
                            <Input style={{ width: '70px', }} />
                            {captcha[0] ? <img style={{ width: '70px', height: '30px', marginLeft: '10px', marginTop: '-5px' }} src={`data:image/png;base64,${captcha[0]}`} alt="" /> : ''}
                            <RedoOutlined className='login-refresh-icon' onClick={() => sendCaptcha(0)} />
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="手机号码"
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号码!',
                            },
                            {
                                pattern: "^((13[0-9])|(14[0|5|6|7|9])|(15[0-3])|(15[5-9])|(16[6|7])|(17[2|3|5|6|7|8])|(18[0-9])|(19[1|8|9]))\\d{8}$",
                                message: '手机号应为11位数字'
                            }
                        ]}
                    >
                        <Input
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="inviteCode"
                        label="内测邀请码"
                        rules={[
                            {
                                required: true,
                                message: '请输入内测邀请码!',
                            },
                        ]}
                    >
                        <Input
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 10,
                            span: 2,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="忘记密码"
                open={open1}
                onCancel={handleCancel1}
                footer={null}
            >
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
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
                    onFinish={resetPassword}
                    autoComplete="on"
                >
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            {
                                type: 'email',
                                message: '邮箱格式错误!',
                            },
                            {
                                required: true,
                                message: '请输入您的邮箱!',
                            },
                        ]}
                    >
                        <div style={{ display: 'flex' }}><Input ref={Email1} /> <Button disabled={!canSendCode1[0]} onClick={() => sendEmail('2')}>{canSendCode1[0] ? '发送邮箱验证码' : canSendCode1[1] + 's后重新发送'}</Button></div>

                    </Form.Item>
                    <Form.Item
                        name="emailCode"
                        label="请填写邮箱验证码"
                        rules={[
                            {
                                required: true,
                                message: '请填写邮箱验证码',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                            {
                                pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$",
                                message: '密码必须包含6-20个大小写字母、数字'

                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 10,
                            span: 2,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            重置密码
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className='Login-form'>.
                <div className='Login-form-title'><img style={{ width: '50px', height: '50px', marginTop: '-5px' }} src={Logo} alt="" /> ChatDB</div>

                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    {/* <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                            {
                                pattern: "^[\\u4e00-\\u9fa5a-zA-Z0-9]{4,12}$",
                                message: '用户名必须为4-12位字母/数字/中文'
                            }
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item> */}
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            {
                                type: 'email',
                                message: '邮箱格式错误!',
                            },
                            {
                                required: true,
                                message: '请输入您的邮箱!',
                            },
                        ]}
                    >
                        <Input />

                    </Form.Item>
                    <Form.Item
                        label='密码'
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!',
                            },
                            {
                                pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$",
                                message: '密码必须包含6-20个大小写字母、数字'

                            }
                        ]}
                    >
                        <div>
                            <Input.Password />
                            <i onClick={showModal1}>忘记密码</i>
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="captchaCode"
                        label="验证码"
                        rules={[
                            {
                                required: true,
                                message: '请填写图形验证码',
                            },
                        ]}
                    >
                        <div>
                            <Input style={{ width: '90px' }} />
                            {captcha[1] ? <img style={{ width: '70px', height: '30px', marginLeft: '10px', marginTop: '-5px' }} src={`data:image/png;base64,${captcha[1]}`} alt="" /> : ''}
                            <RedoOutlined className='login-refresh-icon' onClick={() => sendCaptcha(1)} />
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ marginLeft: '20px', width: '90%', marginBottom: '20px' }} type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button><br></br>
                        <Button style={{ marginLeft: '20px', width: '90%', }} type="primary" onClick={register}>
                            Register
                        </Button>
                    </Form.Item>
                </Form></div>
        </div>
    )
}






