import React, { useState, useEffect } from 'react'
import './index.scss'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import axios from 'axios'
import { Button, Checkbox, Form, Input, message, Modal, Select } from 'antd';
const { Option } = Select;
export default function Login() {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const navigate = useNavigate();
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );
    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };
    const register = () => {
        showModal()
    }
    const onFinish = (values) => {

        // Dismiss manually and asynchronously
        const { username, password } = values
        axios({
            headers: {
                'Content-Type': 'application/json',
                // "Authorization": 'Key 9RrbbCONolmN8qW5caluiu8HMpMZwzM3tDuLv0OO'
            },
            method: 'POST',
            data: {
                username,
                password
            },
            url: `http://8.134.100.212:8081/api/user/login`,
        }).then(res => {
            if (res.data.code !== 200) {
                message.warning(res.data.data)
            } else {
                message.success(res.data.msg)
                sessionStorage.setItem('token', res.data.data.token)
                navigate('/chatdb')
            }
        })
    };
    const onFinishRegister = (values) => {
        const { username, password, email, phone } = values
        axios({
            headers: {
                'Content-Type': 'application/json',
                // "Authorization": 'Key 9RrbbCONolmN8qW5caluiu8HMpMZwzM3tDuLv0OO'
            },
            method: 'GET',
            url: `http://8.134.100.212:8081/api/user/isExists?username=${username}`,
        }).then(res => {
            if (res.data.code !== 200) {
                message.warning(res.data.data)
            } else {
                axios({
                    headers: {
                        'Content-Type': 'application/json',
                        // "Authorization": 'Key 9RrbbCONolmN8qW5caluiu8HMpMZwzM3tDuLv0OO'
                    },
                    method: 'POST',
                    data: {
                        username,
                        password, email, phone
                    },
                    url: `http://8.134.100.212:8081/api/user/register`,
                }).then(res => {
                    if (res.data.code !== 200) {
                        message.warning(res.data.data)
                    } else {
                        message.success(res.data.data)
                        handleCancel()
                    }
                })
            }
        })

    }

    return (
        <div className='Login'>
            <Modal
                title="Register"
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
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone number!',
                            },
                        ]}
                    >
                        <Input
                            addonBefore={prefixSelector}
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
            <div className='Login-form'>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ marginRight: '10px' }} type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <i onClick={register} >register now!</i>
                    </Form.Item>
                </Form></div>
        </div>
    )
}
