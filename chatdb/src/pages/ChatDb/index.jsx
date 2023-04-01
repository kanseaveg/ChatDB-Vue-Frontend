import React, { useState, useEffect } from 'react'
import LeftSidebar from '../../components/LeftSidebar'
import RightMain from '../../components/RightMain'
import './index.scss'
export default function ChatDb() {
    const [current, setCurrent] = useState(-1)
    const [deleteNumber, setDeleteNumber] = useState(-1)
    const [list, setList] = useState(-1)
    const [addText, setAddText] = useState()
    const [addFirstChat, setAddFirstChat] = useState()
    const [dataSourceId, setDataSourceId] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [name, setName] = useState('')
    const [flag, setFlag] = useState(false)
    useEffect(() => {
        let list = localStorage.getItem('list')
        if (!isNaN(list) && list !== null && list !== undefined) {
            setList(parseInt(list))
            setCurrent(parseInt(localStorage.getItem('current')))
        }
        setFlag(true)
    }, [])
    useEffect(() => {
        if (flag) {
            localStorage.setItem('current', current)
            localStorage.setItem('list', parseInt(list))
        }
    }, [current, list])
    return (
        <div className='ChatDb'>
            <LeftSidebar name={name} setName={setName} setRefresh={setRefresh} setDataSourceId={setDataSourceId} addFirstChat={addFirstChat} setAddFirstChat={setAddFirstChat} setAddText={setAddText} list={list} setList={setList} setCurrent={setCurrent} current={current} setDeleteNumber={setDeleteNumber}></LeftSidebar>
            <RightMain setName={setName} setDeleteNumber={setDeleteNumber} setRefresh={setRefresh} refresh={refresh} dataSourceId={dataSourceId} setAddFirstChat={setAddFirstChat} setCurrent={setCurrent} addText={addText} list={list} current={current} deleteNumber={deleteNumber}></RightMain>
        </div>
    )
}
