import React, { useEffect } from "react";
import { Link } from "react-router-dom";    
import logo from "../../assets/img/logo.svg";
import { observer } from 'mobx-react-lite';
import AuthStore from '../../AuthStore';
import '../login/Login.css';

const LoginForm = observer(({usersData}) => {
  const { loginValue, setLoginValue, password, setPassword } = usersData;
  const { validateLogin, isAuth } = AuthStore;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validateLogin(loginValue, password);
      // await checkMe()
      // await checkAuth()
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(localStorage)
    console.log(isAuth)
  }, [isAuth])

  return (
    <div className="authorization">
      <div className="authorization__content">
        <a className="authorization__logo">
          <img src={logo} alt="" className="authorization__logo-img" />
        </a>
        <p className="authorization__content-text">ВХОД В АККАУНТ</p>
        <form className="authorization__form" 
          onSubmit={handleSubmit}
        >
          <input
            required
            type="text"
            placeholder="Логин"
            className="authorization__form-input"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Пароль"
            className="authorization__form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="authorization__form-btn">
            ВОЙТИ
          </button>
          {/* <button type="button" className="authorization__form-btn" onClick={
            () => checkMe()
          }>
            checkMe
          </button>
          <button type="button" className="authorization__form-btn" onClick={
            () => checkAuth()
          }>
            checkAuth
          </button> */}
        </form>
        {/* <Link to="/sign-up" className="authorization__content-dont-acc">
          Нет аккаунта?
        </Link> */}
      </div>
    </div>
  );
});

export default LoginForm;