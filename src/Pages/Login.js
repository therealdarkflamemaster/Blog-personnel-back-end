import React, {useEffect, useState} from "react";
import 'antd/dist/antd.css'
import {Card, Input, Button, Spin, message} from "antd";
import {UserOutlined, LockOutlined } from '@ant-design/icons';
import '../static/css/Login.css'
import axios from 'axios'
import servicePath from '../config/apiUrl'

function Login(props) {


    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const checkLogin = () => {
        setIsLoading(true)
        if(!userName){
            message.error('Please input username')
            setTimeout(()=>{setIsLoading(false)},
            500)
            return false
        }else if(!password){
            message.error('Please input password')
            setTimeout(()=>{setIsLoading(false)},
            500)
            return false
        }
        let dataProps = {
            'userName': userName,
            'password': password
        }

        // console.log(dataProps)

        axios({
            method: 'post',
            url: servicePath.checkLogin,
            data: dataProps,
            withCredentials: true
        }).then (
            res=>{
                setIsLoading(false)
                if(res.data.data == 'Login successful'){
                    console.log(res.data.openId)
                    localStorage.setItem('openId', res.data.openId)
                    props.history.push('/index')
                }else {
                    message.error("wrong username or password")
                }
            }
        )

        setTimeout(()=>{
            setIsLoading(false)
        }, 1000)
    }


    return (
        <div className='login-div'>

            <Spin tip="Loading..." spinning={isLoading}>
                <Card title="Shengxiang Blog System" bordered={true} style={{width:400}}>
                    <Input
                        id="userName"
                        size="large"
                        placeholder="userName"
                        prefix={<UserOutlined style={{color:'rgba(0,0,0,.25)'}} />}
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                    />
                    <br/>
                    <br/>
                    <Input.Password
                        id="password"
                        size="large"
                        type="password"
                        placeholder="Password"
                        prefix={<LockOutlined style={{color:'rgba(0,0,0,.25)'}} />}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                    <br/>
                    <br/>

                    <Button type="primary" size="large" block onClick={checkLogin}>Login</Button>

                </Card>
            </Spin>

        </div>
    )
}


export default Login
