import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";    
import logo from "../../assets/img/logo.svg";
import { observer } from 'mobx-react-lite';
import AuthStore from '../../AuthStore';
import '../login/Login.css';
import { useNavigate } from "react-router-dom";


const TelegramCodeForm = observer(({ usersData }) => {
  const [code, setCode] = useState("");
  const [errorText, setErrorText] = useState("");
  const { loginValue, password } = usersData;
  const { messageFromBot, getTokens } = AuthStore;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        getTokens(loginValue, code)
        navigate('/')
      // await checkMe()
      // await checkAuth()
    } catch (e) {
        setErrorText(e.response.data.detail);
        console.error(e);
    }
  };

  const getCode = async () => {
    try {
      await messageFromBot(loginValue, password);
    } catch (e) {
        setErrorText(e.response.data.detail);
        console.error(e);
    }
  };

  return (
    <div className="authorization">
      <div className="authorization__content">
        <a className="authorization__logo">
          <img src={logo} alt="" className="authorization__logo-img" />
        </a>
        <p className="authorization__content-text">
          ДВУХФАКТОРНАЯ АУТЕНТИФИКАЦИЯ
        </p>
        <p className="tegram-code__text">
          Введите код. Мы отправим его на ваш телеграм.{" "}
          <a href="https://t.me/psihsystem_bot" className="tegram-code__link">
            @psihsystem_bot
          </a>
        </p>
        <button type="button" className="tegram-code-btn" onClick={() => getCode()}>
          Отправить код
        </button>
        <form className="authorization__form" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            placeholder="Код"
            className="authorization__form-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" className="authorization__form-btn">
            ВОЙТИ
          </button>
        </form>
        <p className="tegram-code__error-text">{errorText}</p>
      </div>
    </div>
  );
});

export default TelegramCodeForm;
