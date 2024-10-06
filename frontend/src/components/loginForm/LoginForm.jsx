import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo.svg";

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("submit", login, email, password);
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
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="authorization__form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="authorization__form-btn">
            Зарегистрироваться
          </button>
        </form>
        <Link to="/registration" className="authorization__content-dont-acc">
          Нет аккаунта?
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
