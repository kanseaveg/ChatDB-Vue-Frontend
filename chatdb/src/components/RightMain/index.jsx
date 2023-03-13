import React, { useEffect, useState, useRef } from 'react'
import './index.scss'
import temp from '../../logo.svg'
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios'

export default function RightMain() {
    const [chats, setChats] = useState([[{ who: 'ai', content: 'page1你好' }, { who: 'people', content: 'page1你好3' }], [{ who: 'ai', content: 'page2你好' }, { who: 'people', content: 'page2你好3' }]])
    const [current, setCurrent] = useState(1)
    const peopleInput = useRef()
    const main = useRef()
    const addPeoplechat = () => {
        let value = peopleInput.current.value || ''
        if (value) {
            let newChats = [...chats, { who: 'people', content: value }]
            setChats(newChats)

        }
    }
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            addPeoplechat()
        }
    }
    useEffect(() => {
        if (main.current) {
            main.current.scroll({
                top: 1000000000,
                behavior: 'smooth'
            });
        }

    }, [chats])
    return (
        <div className='RightMain'>
            <div ref={main} className='RightMain-main'>
                <ul>
                    {chats[current]?.map((v, i) => {
                        return (v.who === 'ai' ? <li key={i} className='RightMain-chatli RightMain-aichat'><img className='RightMain-aichat-head' src={temp} alt="" /><div className='RightMain-aichat-content'>{v.content}</div></li> :
                            <li key={i} className='RightMain-chatli RightMain-peoplechat'><div className='RightMain-peoplechat-content'>{v.content}</div><img className='RightMain-peoplechat-head' src={temp} alt="" /></li>)

                    })}
                </ul>
            </div>
            <div className='RightMain-bottom'><div className='input'><input onKeyDown={handleKeyDown} ref={peopleInput} type="text" /><SendOutlined onClick={addPeoplechat} style={{ marginLeft: "-40px" }} /></div></div>
        </div>
    )
}
