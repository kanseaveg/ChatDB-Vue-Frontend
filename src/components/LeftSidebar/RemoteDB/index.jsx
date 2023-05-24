import { Button, Form, Input, Select, message, Steps } from 'antd';
import { useState } from 'react';
import './index.scss'
import axios from 'axios'
import URL from '../../../env.js'

const { Option } = Select;
const RemoteDB = ({ handleCancel3, getLinks }) => {
    const [form] = Form.useForm();
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [step, setStep] = useState(0)
    const [options, setOptions] = useState()
    const onFinish = (values) => {
        setLoading1(true)
        axios({
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            method: 'POST',
            url: `${URL}/api/db/connect/getSchema`,
            data: {
                ...values, userId
            }
        }).then(res => {
            setLoading1(false)
            if (res.data.code === 200) {
                setStep(0)
                message.success(res.data.msg)
                handleCancel3()
                getLinks()
            } else {
                message.warning(res.data.data || res.data.msg)
            }
        }).catch(e => {
            setLoading1(false)
            console.log(e);
            message.warning(e.response?.data?.data || e.response?.data?.msg)
        })
    };
    const test = async () => {
        try {
            await form.validateFields(['databaseType', 'host', 'port', 'username', 'password']);
            // 表单验证通过，可以继续提交操作
            const allFields = form.getFieldsValue(true);
            setLoading(true)
            axios({
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                method: 'POST',
                url: `${URL}/api/db/connect`,
                data: {
                    ...allFields, userId
                }
            }).then(res => {
                setLoading(false)
                setStep(1)
                if (res.data.code === 200) {
                    message.success(res.data.msg)
                    let data = res.data.data.databaseNames
                    let options = []
                    data.map((v) => {
                        options.push({ label: v, value: v })
                    })
                    console.log(options);
                    setOptions(options)
                } else {
                    message.warning(res.data.data || res.data.msg)
                }
            }).catch(e => {
                setLoading(false)
                console.log(e);
            })
        } catch (error) {
            // 表单验证未通过，提示错误信息
            message.error('Please fill in all the fields.');
        }
    }
    return (
        <><Steps
            current={step}
            items={[
                {
                    title: 'Test link',
                },
                {
                    title: 'Select db',
                },
            ]}
        />
            <Form
                className='remoteDB'
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={onFinish}
            >
                <Form.Item
                    className={step === 1 ? 'hidden' : ''}
                    name="databaseType"
                    label="Database type"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        placeholder="Select a database"
                        allowClear
                    >
                        <Option value="mysql">MySQL</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    className={step === 1 ? 'hidden' : ''}

                    label="Title" name='title' rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Input placeholder="Connection title" />
                </Form.Item>
                <Form.Item className={step === 1 ? 'hidden' : ''} label="Host" name='host' rules={[
                    {
                        required: true,
                    },
                ]}>
                    <Input placeholder="Connection host" />
                </Form.Item>
                <Form.Item
                    className={step === 1 ? 'hidden' : ''}
                    name='port'
                    label="Port"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input placeholder="Connection port" />
                </Form.Item>
                <Form.Item
                    className={step === 1 ? 'hidden' : ''}
                    name='username'
                    label="Username"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input placeholder="Connection username" />
                </Form.Item>
                <Form.Item
                    className={step === 1 ? 'hidden' : ''}
                    name='password'
                    label="Password"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input placeholder="Connection password" />
                </Form.Item>
                <Form.Item className={step === 1 ? 'hidden' : ''} wrapperCol={{ offset: 10 }}>
                    <Button loading={loading} type="primary" onClick={test}>getDBlists</Button>
                </Form.Item>
                <Form.Item
                    className={step === 0 ? 'hidden' : ''}
                    name="selectedDB"
                    label="Select DB"
                    rules={[
                        {
                            required: true,
                            message: "'selectedDB' is required,please getDBlists first",

                        },
                    ]}
                >
                    <Select
                        name="selectedDB"
                        label="Select DB"
                        mode="multiple"
                        allowClear
                        options={options}
                        suffixIcon={null}
                    >

                    </Select>
                </Form.Item>

                <Form.Item className={step === 0 ? 'hidden' : ''} wrapperCol={{ offset: 16 }}>
                    <Button onClick={() => setStep(0)} style={{ marginRight: '10px' }} >Return</Button>
                    <Button loading={loading1} type='primary' htmlType="submit">Save</Button>
                </Form.Item>

            </Form>
        </>
    );
};
export default RemoteDB;