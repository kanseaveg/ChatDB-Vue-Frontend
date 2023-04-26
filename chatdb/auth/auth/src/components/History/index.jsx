import React, { useEffect, useState } from 'react'
import { Table, Space, Tag, Tooltip } from 'antd';
import './index.scss'
import { NotaNumber } from '../../utils/func'
import serviceAxios from '../../request'
import MyTable from '../MyTable';
export default function History({ searchValue }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getData(searchValue)
    }, [searchValue])
    const getData = (searchValue = '') => {
        setLoading(true)
        let userId = ''
        let chatId = ''
        if (NotaNumber(searchValue)) {
            if (searchValue.includes('-')) {
                chatId = searchValue
            }
            else {
                userId = searchValue
            }
        }
        const params = { userId, chatId }
        serviceAxios.get(`admin/chat_log/search`, { params: params })
            .then((res) => {
                setLoading(false)
                setData(res.data.map((v, i) => (
                    {
                        ...v,
                        key: i, createTime: v.createTime ? v.createTime.split('T')[0] + ' ' + v.createTime.split('T')[1].split('.')[0] : '',
                    })))
            })
    }

    const deleteDB = (id) => {
        setLoading(true)
        serviceAxios.delete(`admin/chat_log/delete/${id}`)
            .then((res) => {
                setLoading(false)
                getData(searchValue)
            })
    }
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            width: 100
        },
        {
            title: 'userId',
            dataIndex: 'userId',
            key: 'userId',
            width: 100
        },
        {
            title: 'chatId',
            dataIndex: 'chatId',
            key: 'chatId',
            width: 100
        },
        {
            title: 'message_type',
            dataIndex: 'message_type',
            key: 'message_type',
            width: 150
        },
        {
            title: 'user_type',
            dataIndex: 'user_type',
            key: 'user_type',
            width: 150,
            filters: [
                {
                    text: 'DB',
                    value: 'DB',
                },
                {
                    text: 'USER',
                    value: 'USER',
                },
            ],
            onFilter: (value, record) => record.user_type.indexOf(value) === 0,
        },
        {
            title: 'message',
            dataIndex: 'message',
            key: 'message',
            width: 120
        },
        {
            title: 'msg',
            dataIndex: 'msg',
            key: 'msg',
            width: 300
        },
        {
            title: 'createTime',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 200
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 100,

            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => deleteDB(record.id)}>delete</a>
                </Space>
            ),
        },
    ];

    return (
        <MyTable loading={loading} columns={columns} data={data} />
    )
}
