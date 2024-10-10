import React, { useState } from "react";
import { Link } from "react-router-dom";    
import logo from "../../assets/img/logo.svg";
import { observer } from 'mobx-react-lite';
import AuthStore from '../../AuthStore';

const LoginForm = observer(() => {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const { login, checkMe, checkAuth } = AuthStore;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(loginValue, password);
      await checkMe();
      // await checkAuth();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Ошибка при входе. Пожалуйста, проверьте ваши данные.");
    }
  };

  return (
    <div className="authorization">
      <div className="authorization__content">
        <a className="logo">
          <img src={logo} alt="" className="logo-img" />
        </a>
        <p className="authorization__content-text">ВХОД В АККАУНТ</p>
        <form className="authorization__form" onSubmit={handleSubmit}>
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
        </form>
        <Link to="/sign-up" className="authorization__content-dont-acc">
          Нет аккаунта?
        </Link>
      </div>
    </div>
  );
});

export default LoginForm;