import React, { useState, useEffect } from 'react'
import LeftSidebar from '../../components/LeftSidebar'
import RightMain from '../../components/RightMain'
import URL from '../../env.js'
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
    const [uploadAndRefresh, setUploadAndRefresh] = useState(false)
    const [dbDisabled, setDbDisabled] = useState(false)
    const [lock, setLock] = useState(true)
    const [changeModel, setChangeModel] = useState({ type: -1, add: false })
    // useEffect(() => {
    //     let list = parseInt(localStorage.getItem('list'))
    //     let current = parseInt(localStorage.getItem('current'))

    //     if (!isNaN(list) && list !== null && list !== undefined && !isNaN(current) && current !== null && current !== undefined) {
    //         setList(parseInt(list))
    //         setCurrent(parseInt(current))
    //     }
    //     setFlag(true)
    // }, [])

    useEffect(() => {
        localStorage.setItem('current', parseInt(current))
        localStorage.setItem('list', parseInt(list))
    }, [current, list])
    return (
        <div className='ChatDb'>
            <LeftSidebar changeModel={changeModel} setChangeModel={setChangeModel} setLock={setLock} dbDisabled={dbDisabled} uploadAndRefresh={uploadAndRefresh} setUploadAndRefresh={setUploadAndRefresh} name={name} setName={setName} setRefresh={setRefresh} setDataSourceId={setDataSourceId} addFirstChat={addFirstChat} setAddFirstChat={setAddFirstChat} setAddText={setAddText} list={list} setList={setList} setCurrent={setCurrent} current={current} setDeleteNumber={setDeleteNumber}></LeftSidebar>
            <RightMain changeModel={changeModel} setChangeModel={setChangeModel} lock={lock} setLock={setLock} setAddText={setAddText} setDbDisabled={setDbDisabled} setUploadAndRefresh={setUploadAndRefresh} setName={setName} setDeleteNumber={setDeleteNumber} setRefresh={setRefresh} refresh={refresh} dataSourceId={dataSourceId} setAddFirstChat={setAddFirstChat} setCurrent={setCurrent} addText={addText} list={list} current={current} deleteNumber={deleteNumber}></RightMain>
        </div>
    )
}
