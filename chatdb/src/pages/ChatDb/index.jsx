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
    const [dataSourceId, setDataSourceId] = useState(1)
    const [refresh, setRefresh] = useState(false)
    const [name, setName] = useState('')
    useEffect(() => {
        let list = localStorage.getItem('list')
        if (list !== 0 && list !== '0' && !isNaN(list) && list !== null && list !== undefined) {
            console.log(list, 'getlist');
            setList(parseInt(list))
            setCurrent(localStorage.getItem('current'))
        }
    }, [])
    useEffect(() => {
        if (list !== -1) {
            console.log(current, 'currentset');
            localStorage.setItem('current', current)
            localStorage.setItem('list', parseInt(list))
        }
    }, [current, list])
    return (
        <div className='ChatDb'>
            <LeftSidebar name={name} setName={setName} setRefresh={setRefresh} setDataSourceId={setDataSourceId} addFirstChat={addFirstChat} setAddText={setAddText} list={list} setList={setList} setCurrent={setCurrent} current={current} setDeleteNumber={setDeleteNumber}></LeftSidebar>
            <RightMain setName={setName} setRefresh={setRefresh} refresh={refresh} dataSourceId={dataSourceId} setAddFirstChat={setAddFirstChat} setCurrent={setCurrent} addText={addText} list={list} current={current} deleteNumber={deleteNumber}></RightMain>
        </div>
    )
}
