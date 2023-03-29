import React, { useState, useEffect, useRef } from "react";
import { message } from 'antd';
import './index.scss'
import axios from 'axios'

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
        console.log(Email);
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (Email && regex.test(Email)) {
            console.log('合法的');
            //Email 就是邮箱 
            axios({
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                url: `http://localhost:8081/api/user/subscribe?email=${Email}`,
            }).then(res => {
                console.log(res, 'res');
                if (res.data.code === 200) {
                    message.success('订阅成功')
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
                <h1>Coming Soon</h1>
                <p>Chat2DB is launching on April 1, 2023!</p>
                <div className="countdown">
                    <div className="countdown-item">
                        <div className="countdown-value">{countdown.days}</div>
                        <div className="countdown-label">Days</div>
                    </div>
                    <div className="countdown-item">
                        <div className="countdown-value">{countdown.hours}</div>
                        <div className="countdown-label">Hours</div>
                    </div>
                    <div className="countdown-item">
                        <div className="countdown-value">{countdown.minutes}</div>
                        <div className="countdown-label">Minutes</div>
                    </div>

                    <div className="countdown-item">
                        <div className="countdown-value">{countdown.seconds}</div>
                        <div className="countdown-label">Seconds</div>
                    </div>
                </div>

                <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                    <input ref={email} type="email" placeholder="Enter your email address" />
                    <button onClick={submit}>Subscribe</button>
                </form>

            </div>


            <div className="right">
                <h1 style={{ fontSize: '38px' }}>Chat2DB</h1>
                <p style={{ marginTop: "-0px" }}>Ask anything about your Database!</p>
            </div>
        </div>

    );
}

export default ComingSoon;