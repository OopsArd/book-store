import React, {useEffect, useState} from 'react'
import FloatInput from '../../components/FloatInput/FloatInput'
import { useNavigate } from 'react-router'
import axios from 'axios'

import './login.css'

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setErr] = useState(null);

    const handleInputUsername = (value) => {
        setUsername(value);
    }

    const handleInputPassword = (value) => {
        setPassword(value);
    }

    useEffect(() => {
        setErr(null)
    },[username, password])

    const btnLoginClick = (e) => {
        e.preventDefault();

        const account = {username: username, password: password};
        console.log("acc: ", account)
        let dataToServer = JSON.stringify(account);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:8080/api/v1/users',
            headers:{
            'Content-Type': 'application/json'
            },
            data: dataToServer
        };

        axios.request(config)
        .then(res => {
            console.log(res.data);
            const respon = res.data;
            if(respon.status_code != 200){
                setErr({title: 'Tên đăng nhập hoặc mật khẩu không chính xác', type: 'error'})
                return
            }
            const token = respon.data;
            localStorage.setItem('ACCESS_TOKEN', token);
            navigate('/')
        })
    }

  return (
    <div className='login-page'>
        <form className="login-form" onSubmit={btnLoginClick}>
            <h1>Đăng nhập</h1>
            <FloatInput disable={false} handleDisable={() => false} className="inputUserName" handleInput={handleInputUsername} label="Tên đăng nhập" placeholder="Tên đăng nhập" name="username" require={true}/>
            <FloatInput disable={false} handleDisable={() => false} className="inputUserName" handleInput={handleInputPassword} label="Mật khẩu" placeholder="Mật khẩu" name="password" type='password' require={true}/>
            {error && <div className='error'>{error?.title}</div>}
            <button className='btnLogin'>Đăng nhập</button>
        </form>
    </div>
  )
}

export default LoginPage