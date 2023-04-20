import React, { useEffect, useState } from 'react'
import { Table, Space, Tag } from 'antd';
import './index.scss'
import { NotaNumber } from '../../utils/func'
import serviceAxios from '../../request'

export default function PublicDb({ searchValue }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getData(searchValue)
    }, [searchValue])
    const getData = (searchValue = '') => {
        setLoading(true)
        serviceAxios.get(`admin/public_db/search?id=${NotaNumber(searchValue) ? '' : searchValue}&dbName=${NotaNumber(searchValue) ? searchValue : ''}`)
            .then((res) => {
                setLoading(false)
                console.log(res)
                setData(res.data.map((v, i) => (
                    {
                        ...v,
                        key: i, createTime: v.createTime.split('T')[0] + ' ' + v.createTime.split('T')[1].split('.')[0],
                        updateTime: v.updateTime.split('T')[0] + ' ' + v.updateTime.split('T')[1].split('.')[0],
                        tags: v.isDeleted ? ['deleted'] : ['normal']
                    })))
            })
    }

    const deleteDB = (dbName) => {
        setLoading(true)
        serviceAxios.delete(`admin/public_db/${dbName}`)
            .then((res) => {
                setLoading(false)
                console.log(res)
                getData(searchValue)
            })
    }
    const restoreDB = (id) => {
        setLoading(true)
        serviceAxios.post(`admin/public_db/restore/${id}`)
            .then((res) => {
                setLoading(false)
                console.log(res)
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
            title: 'updateTime',
            dataIndex: 'updateTime',
            key: 'updateTime',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            filters: [
                {
                    text: 'NORMAL',
                    value: 'normal',
                },
                {
                    text: 'DELETED',
                    value: 'deleted',
                },
            ],
            onFilter: (value, record) => record.tags.indexOf(value) === 0,
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag === 'deleted' ? 'red' : 'green';
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
            render: (_, record) => (
                <Space size="middle">
                    {record.isDeleted ? <a onClick={() => restoreDB(record.id)}>restore</a> :
                        <a onClick={() => deleteDB(record.dbName)}>delete</a>}

                </Space>
            ),
        },
    ];














    return (
        <div>
            <Table size='middle' scroll={{
                x: 400,
                y: 480
            }} loading={loading} columns={columns} dataSource={data} />
        </div>
    )
}
