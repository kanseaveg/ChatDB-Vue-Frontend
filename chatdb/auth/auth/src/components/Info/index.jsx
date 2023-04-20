import React, { useEffect, useState } from 'react'
import { Table, Space, Tag, Form, Input, Modal, Button, message } from 'antd';
import './index.scss'
import { NotaNumber } from '../../utils/func'
import serviceAxios from '../../request'

export default function Info({ searchValue }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [userId, setuserId] = useState('')
    useEffect(() => {
        getData(searchValue)
    }, [searchValue])
    const getData = (searchValue = '') => {
        setLoading(true)
        let userId = ''
        let userName = ''
        let email = ''
        let phone = ''
        let roleId = ''
        var reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
        if (!NotaNumber(searchValue) && parseInt(searchValue) > 10000000000) {
            phone = searchValue
        } else if (reg.test(searchValue)) {
            email = searchValue
        } else if (!NotaNumber(searchValue) && parseInt(searchValue) < 10) {
            roleId = searchValue
        } else if (searchValue.length <= 12) {
            userName = searchValue
        } else {
            userId = searchValue
        }
        const params = { userId, userName, email, phone, roleId }
        serviceAxios.get(`admin/user_manager/search`, { params: params })
            .then((res) => {
                setLoading(false)
                console.log(res)
                setData(res.data.map((v, i) => (
                    {
                        ...v,
                        key: i, createTime: v.createTime.split('T')[0] + ' ' + v.createTime.split('T')[1].split('.')[0],
                        updateTime: v.updateTime.split('T')[0] + ' ' + v.updateTime.split('T')[1].split('.')[0],
                        lastLoginTime: v.lastLoginTime ? v.lastLoginTime.split('T')[0] + ' ' + v.lastLoginTime.split('T')[1].split('.')[0] : '',
                        tags: v.roleId === 1 ? ['USER'] : v.roleId === 2 ? ['PLUS'] : v.roleId === 3 ? ['ADMIN'] : []
                    })))
            })
    }

    const deleteDB = (userId) => {
        setLoading(true)
        serviceAxios.delete(`admin/user_manager/delete_user/${userId}`)
            .then((res) => {
                setLoading(false)
                console.log(res)
                getData(searchValue)
            })
    }
    const update = (userId) => {
        setuserId(userId)
        setOpen(true)
    }
    const columns = [

        {
            title: 'userId',
            dataIndex: 'userId',
            key: 'userId',
            fixed: 'left',

        },
        {
            title: 'username',
            dataIndex: 'username',
            key: 'username',
            fixed: 'left',


        },

        {
            title: 'email',
            dataIndex: 'email',
            key: 'email',

        },
        {
            title: 'phone',
            dataIndex: 'phone',
            key: 'phone',

        },
        {
            title: 'password',
            dataIndex: 'password',
            key: 'password',

        },
        {
            title: 'lastLoginTime',
            dataIndex: 'lastLoginTime',
            key: 'lastLoginTime',
        },
        {
            title: 'createTime',
            dataIndex: 'createTime',
            key: 'createTime',

        },
        {
            title: 'updateTime',
            dataIndex: 'updateTime',
            key: 'updateTime',

        },
        {
            title: 'role',
            key: 'tags',
            dataIndex: 'tags',
            fixed: 'right',
            filters: [
                {
                    text: 'USER',
                    value: 'USER',
                },
                {
                    text: 'PLUS',
                    value: 'PLUS',
                },
                {
                    text: 'ADMIN',
                    value: 'ADMIN',
                },
            ],
            onFilter: (value, record) => record.tags.indexOf(value) === 0,
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag === 'USER' ? 'green' : tag === 'PLUS' ? 'yellow' : 'geekblue';
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => deleteDB(record.userId)}>delete</a>
                    <a onClick={() => update(record.userId)}>update</a>
                </Space>
            ),
        },

    ];



    const onFinish = (values) => {
        serviceAxios.post('admin/user_manager/update_user', { ...values, userId: userId }).then((res) => {
            console.log(res);
            if (res.code === 200) {
                message.success('修改成功！')
                getData(searchValue)
                setOpen(false)
            } else {
                message.warning(res.data || res.msg)
            }
        })
    };










    return (
        <div>
            <Modal
                title="更新用户"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <Form
                    name="basic"
                    labelCol={{
                        span: 5,
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
                    onFinish={onFinish}
                    autoComplete="on"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[
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
                        ]}
                    >
                        <Input />

                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="手机号码"
                        rules={[
                            {
                                pattern: "^((13[0-9])|(14[0|5|6|7|9])|(15[0-3])|(15[5-9])|(16[6|7])|(17[2|3|5|6|7|8])|(18[0-9])|(19[1|8|9]))\\d{8}$",
                                message: '手机号格式错误'
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
                        name="roleId"
                        label="roleId"
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
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Table size='middle' scroll={{
                x: 400,
                y: 480
            }} loading={loading} columns={columns} dataSource={data} />
        </div>
    )
}
