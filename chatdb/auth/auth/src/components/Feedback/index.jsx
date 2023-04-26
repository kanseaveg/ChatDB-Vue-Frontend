import React, { useEffect, useState } from 'react'
import { Table, Space, Tag } from 'antd';
import './index.scss'
import { NotaNumber } from '../../utils/func'
import serviceAxios from '../../request'
import MyTable from '../MyTable';
export default function UserDb({ searchValue }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getData(searchValue)
    }, [searchValue])
    const getData = (searchValue = '') => {
        setLoading(true)
        let userId = ''
        let chatId = ''
        let db = ''
        function containsNumber(str) {
            return !!str.match(/\d/g);
        }
        if (NotaNumber(searchValue)) {
            if (searchValue.includes('-')) {
                chatId = searchValue
            }
            else if (searchValue.includes('$') || !containsNumber(searchValue)) {
                db = searchValue
            } else {
                userId = searchValue
            }
        }
        const params = { userId, chatId, db }
        serviceAxios.get(`admin/feedback/search`, { params: params })
            .then((res) => {
                setLoading(false)
                setData(res.data.map((v, i) => (
                    {
                        ...v,
                        key: i, create_time: v.create_time ? v.create_time.split('T')[0] + ' ' + v.create_time.split('T')[1].split('.')[0] : '',
                        like_flag: v.like_flag === 1 ? ['like'] : ['dislike']
                    })))
            })
    }

    const deleteDB = (id) => {
        setLoading(true)
        serviceAxios.delete(`admin/feedback/delete/${id}`)
            .then((res) => {
                setLoading(false)
                getData(searchValue)
            })
    }
    const columns = [
        {
            title: 'userId',
            dataIndex: 'userId',
            key: 'userId',
            fixed: 'left',

            width: 150,

        },
        {
            title: 'chatId',
            dataIndex: 'chatId',
            key: 'chatId',
            fixed: 'left',

            width: 150

        },
        {
            title: 'db',
            dataIndex: 'db',
            key: 'db',
            width: 150


        },
        {
            title: 'question',
            dataIndex: 'question',
            key: 'question',
            width: 200


        },
        {
            title: 'current_sql',
            dataIndex: 'current_sql',
            key: 'current_sql',
            width: 200



        },
        {
            title: 'golden_sql',
            dataIndex: 'golden_sql',
            key: 'golden_sql',
            width: 200



        },

        {
            title: 'feedback_description',
            dataIndex: 'feedback_description',
            key: 'feedback_description',
            width: 200

        },
        {
            title: 'createTimeStart',
            dataIndex: 'create_time',
            key: 'create_time',
            width: 150


        },
        {
            title: 'like_flag',
            dataIndex: 'like_flag',
            key: 'like_flag',
            fixed: 'right',
            width: 100,
            filters: [
                {
                    text: 'like',
                    value: 'like',
                },
                {
                    text: 'dislike',
                    value: 'dislike',
                },
            ],
            onFilter: (value, record) => record.like_flag.indexOf(value) === 0,
            render: (_, { like_flag }) => (
                <>
                    {like_flag.map((tag) => {
                        let color = tag === 'like' ? 'green' : 'red';
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
                    <a onClick={() => deleteDB(record.id)}>delete</a>
                </Space>
            ),
            width: 100


        },
    ];














    return (
        <MyTable loading={loading} columns={columns} data={data} />

    )
}
