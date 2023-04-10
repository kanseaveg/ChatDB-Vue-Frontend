import React from 'react'
import './index.scss'
import { WarningOutlined, BulbOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Myreplace } from '../../utils/func';
export default function Introduce({ setAddText }) {
    const data = [{ title: 'Examples', icon: <BulbOutlined className='Introduce-main-topIcon' />, message: ['"向我展示nba里面所有球队的信息"', '"nba中勒布朗詹姆斯打什么位置?"', '"湖人"队有哪些球员出生晚于1980年且出生于美国?'] },
    { title: 'Capabilities', icon: <ThunderboltOutlined className='Introduce-main-topIcon' />, message: ['You can talk everything with DB', 'Allow user to provide data to query', 'Trained to decline wrong sql queries'] },
    { title: 'Limitations', icon: <WarningOutlined className='Introduce-main-topIcon' />, message: ["May occasionally generate some incorrect SQL query statement", "May occasionally query no enough data", "Limited knowledge of public db and db content"] }]
    return (
        <div className='Introduce'>
            <p className='Introduce-title'>Chat2DB</p>
            <ul className='Introduce-main'>
                {data ? data.map((v, i) => {
                    return (
                        <li key={i}>
                            <div className='Introduce-main-top'>
                                {v.icon}
                                {v.title}
                            </div>
                            <ul>
                                {v.message.map((value, index) => {
                                    return (<li className={i === 0 ? 'addText' : ''} onClick={i === 0 ? () => setAddText(Myreplace((value), ['"'])) : ''} key={index}>{value}</li>)
                                })}
                            </ul>
                        </li>)
                }) : ''}
            </ul>

        </div>
    )
}
