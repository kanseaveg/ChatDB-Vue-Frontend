import React, { useState, useEffect, useRef } from "react";
import { message } from 'antd';
import './index.scss'
import URL from '../../env.js'
import axios from 'axios'
import Wait from '../../assests/images/wait.gif'
function ComingSoon() {
    const [countdown, setCountdown] = useState({
        days: "",
        hours: "",
        minutes: "",
        seconds: "",
    });
    const email = useRef()
    //邮箱订阅函数
    const submit = () => {
        let Email = email.current.value
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (Email && regex.test(Email)) {
            //Email 就是邮箱 
            axios({
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                url: `${URL}/api/user/subscribe?email=${Email}`,
            }).then(res => {
                if (res.data.code === 200) {
                    message.success(res.data.data || res.data.msg)
                } else {
                    message.warning(res.data.msg)
                }
            })
        } else {
            message.warning('请输入正确的邮箱地址！')
        }
    }
    // 设置到期日期并计算剩余时间
    useEffect(() => {
        const launchDate = new Date("2023-04-01T00:00:00Z").getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <div className="coming-soon">
                <h1>Chat2DB</h1>
                <h1>Ask anything about your Database</h1>

                <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                    <input ref={email} type="email" placeholder="Enter your email address" />
                    <button onClick={submit}>Join Waitlist</button>
                </form>

            </div>


            <img className="right" src={Wait} alt="" />
        </div>

    );
}

export default ComingSoon;