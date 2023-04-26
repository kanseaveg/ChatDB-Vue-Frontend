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
        serviceAxios.get(`admin/user_db/search?id=${NotaNumber(searchValue) ? '' : searchValue}&dbName=${NotaNumber(searchValue) && searchValue.includes('$') ? searchValue : ''}&userId=${NotaNumber(searchValue) && !searchValue.includes('$') ? searchValue : ''}`)
            .then((res) => {
                setLoading(false)

                setData(res.data.map((v, i) => (
                    {
                        ...v,
                        key: i, createTime: v.createTime ? v.createTime.split('T')[0] + ' ' + v.createTime.split('T')[1].split('.')[0] : '',
                    })))
            })
    }

    const deleteDB = (dbName) => {
        setLoading(true)
        serviceAxios.delete(`admin/user_db/${dbName}`)
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
        },
        {
            title: 'dbName',
            dataIndex: 'dbName',
            key: 'dbName',
        },
        {
            title: 'createTime',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: 'userId',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => deleteDB(record.dbName)}>delete</a>
                </Space>
            ),
        },
    ];














    return (
        <MyTable loading={loading} columns={columns} data={data} />

    )
}
