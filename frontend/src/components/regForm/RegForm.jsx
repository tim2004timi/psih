import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo.svg";

const RegForm = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    console.log("submit", login, email, password);
  };

  return (
    <div className="authorization">
      <div className="authorization__content">
        <a className="logo">
          <img src={logo} alt="Логотип" className="logo-img" />
        </a>
        <p className="authorization__content-text">РЕГИСТРАЦИЯ</p>
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
          <input
            required
            type="password"
            placeholder="Пароль"
            className="authorization__form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Повторите пароль"
            className="authorization__form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="authorization__form-btn">
            Зарегистрироваться
          </button>
        </form>
        <Link to="/login" className="authorization__content-dont-acc">
          Уже есть аккаунт?
        </Link>
      </div>
    </div>
  );
};

export default RegForm;