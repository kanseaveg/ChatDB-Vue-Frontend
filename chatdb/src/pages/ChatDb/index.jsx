import React, { useState } from 'react'
import LeftSidebar from '../../components/LeftSidebar'
import RightMain from '../../components/RightMain'

export default function ChatDb() {
    const [current, setCurrent] = useState(0)
    const [deleteNumber, setDeleteNumber] = useState(-1)
    const [list, setList] = useState(0)
    const [addText, setAddText] = useState()
    const [addFirstChat, setAddFirstChat] = useState()
    const [dataSourceId, setDataSourceId] = useState(1)
    return (
        <>
            <LeftSidebar setDataSourceId={setDataSourceId} addFirstChat={addFirstChat} setAddText={setAddText} list={list} setList={setList} setCurrent={setCurrent} setDeleteNumber={setDeleteNumber}></LeftSidebar>
            <RightMain dataSourceId={dataSourceId} setAddFirstChat={setAddFirstChat} setCurrent={setCurrent} addText={addText} list={list} current={current} deleteNumber={deleteNumber}></RightMain>
        </>
    )
}
