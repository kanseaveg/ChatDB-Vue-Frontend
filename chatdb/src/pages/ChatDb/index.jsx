import React, { useState, useEffect } from 'react'
import LeftSidebar from '../../components/LeftSidebar'
import RightMain from '../../components/RightMain'
import './index.scss'
import { useNavigate } from 'react-router-dom';

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
    const [colorTheme, setColorTheme] = useState('light')
    const token = localStorage.getItem('token')
    const navigate = useNavigate();
  

    useEffect(() => {
        if(!token){
            navigate('/login')
        }
        localStorage.setItem('current', parseInt(current))
        localStorage.setItem('list', parseInt(list))
    }, [current, list])
    return (
        <div className='ChatDb'>
            <LeftSidebar setColorTheme={setColorTheme} changeModel={changeModel} setChangeModel={setChangeModel} setLock={setLock} dbDisabled={dbDisabled} uploadAndRefresh={uploadAndRefresh} setUploadAndRefresh={setUploadAndRefresh} name={name} setName={setName} setRefresh={setRefresh} setDataSourceId={setDataSourceId} addFirstChat={addFirstChat} setAddFirstChat={setAddFirstChat} setAddText={setAddText} list={list} setList={setList} setCurrent={setCurrent} current={current} setDeleteNumber={setDeleteNumber}></LeftSidebar>
            <RightMain colorTheme={colorTheme} changeModel={changeModel} setChangeModel={setChangeModel} lock={lock} setLock={setLock} setAddText={setAddText} setDbDisabled={setDbDisabled} setUploadAndRefresh={setUploadAndRefresh} setName={setName} setDeleteNumber={setDeleteNumber} setRefresh={setRefresh} refresh={refresh} dataSourceId={dataSourceId} setAddFirstChat={setAddFirstChat} setCurrent={setCurrent} addText={addText} list={list} current={current} deleteNumber={deleteNumber}></RightMain>
        </div>
    )
}
