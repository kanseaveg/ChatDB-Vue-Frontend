import React, { useState, useEffect } from 'react'
import './index.scss'
import { WarningOutlined, BulbOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Myreplace, copyArr } from '../../utils/func';
export default function Introduce({ setAddText, myCurrent }) {
    const [data, setData] = useState([{ title: 'Examples', icon: <BulbOutlined className='Introduce-main-topIcon' />, message: ['"向我展示nba里面所有球队的信息"', '"勒布朗詹姆斯打什么位置?"', '"湖人"队有哪些球员出生晚于1980年且出生于美国?'] },
    { title: 'Capabilities', icon: <ThunderboltOutlined className='Introduce-main-topIcon' />, message: ['You can talk everything with DB', 'Allow user to provide data to query', 'Trained to decline wrong sql queries'] },
    { title: 'Limitations', icon: <WarningOutlined className='Introduce-main-topIcon' />, message: ["May occasionally generate some incorrect SQL query statement", "May occasionally query no enough data", "Limited knowledge of public db and db content"] }])

    useEffect(() => {
        if (myCurrent >= 0 && data && data.length) {
            let title = JSON.parse(localStorage.getItem('chat'))[myCurrent].db.title
            let Nowdata = copyArr(data)
            switch (title) {
                case 'nba':
                    Nowdata[0].message = ['"向我展示nba里面所有球队的信息"', '"勒布朗詹姆斯打什么位置?"', '"湖人"队有哪些球员出生晚于1980年且出生于美国?']
                    break;
                case 'finance':
                    Nowdata[0].message = ['"向我展示finance里面所有的金融数据"', '"请列出贷款金额大于10000且信用评级为A的金融客户信息"', '"年收入在110000美元以上的人，有多少贷款过？"',]
                    break;
                default:
                    Nowdata[0].message = null
                    break;
            }
            setData(Nowdata)
        }
    }, [myCurrent])

    return (
        <div className='Introduce'>
            <p className='Introduce-title'>Chat2DB</p>
            <ul className='Introduce-main'>
                {data && data.length !== 0 ? data.map((v, i) => {
                    if (v.message) {
                        return (<li key={i}>
                            <div className='Introduce-main-top'>
                                {v.icon}
                                {v.title}
                            </div>
                            <ul>
                                {v.message.map((value, index) => {
                                    return (<li className={i === 0 ? 'addText' : ''} onClick={i === 0 ? () => setAddText(Myreplace((value), ['"'])) : () => { }} key={index}>{value}</li>)
                                })}
                            </ul>
                        </li>)
                    }
                }) : ''}
            </ul>

        </div>
    )
}
