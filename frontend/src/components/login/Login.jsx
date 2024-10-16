import React, { useState, useEffect } from 'react';
import LoginForm from '../loginForm/LoginForm';
import TelegramCodeForm from '../loginForm/TelegramCodeForm';
import { observer } from 'mobx-react-lite';
import AuthStore from '../../AuthStore';

const Login =  observer(() => {
    const [loginValue, setLoginValue] = useState("");
    const [password, setPassword] = useState("");
    const { isValidated } = AuthStore;

    const usersData = {
        loginValue,
        setLoginValue,
        password,
        setPassword,
    };

    return ( 
        <>
            {isValidated ? <TelegramCodeForm usersData={usersData} /> : <LoginForm usersData={usersData} />}
        </>
    );
});

export default Login;