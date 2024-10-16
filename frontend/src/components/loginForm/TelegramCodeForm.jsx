import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";    
import logo from "../../assets/img/logo.svg";
import { observer } from 'mobx-react-lite';
import AuthStore from '../../AuthStore';
import '../login/Login.css';
import telegram_qr_img from '../../assets/img/telegram-qr-img.png';
import telegram_qr from '../../assets/img/telegram-qr.png';

const TelegramCodeForm = observer(({ usersData }) => {
  const [code, setCode] = useState("");
  const [errorText, setErrorText] = useState("");
  const [timer, setTimer] = useState(0);
  const { loginValue, password } = usersData;
  const { messageFromBot, getTokens, isAuth, checkAuth } = AuthStore;
  const navigate = useNavigate();
  const isTimerActive = timer > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await getTokens(loginValue, code);

      // navigate('/warehouse/orders');
    } catch (e) {
      setErrorText(e.response.data.detail);
      console.error(e);
    }
  };

  const getCode = async () => {
    try {
      await messageFromBot(loginValue, password);
      setTimer(120);
    } catch (e) {
      setErrorText(e.response.data.detail);
      console.error(e);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

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
        <button 
          type="button" 
          className="tegram-code-btn" 
          onClick={() => getCode()}
          disabled={isTimerActive}
        >
          {isTimerActive ? `${'0' + Math.floor(timer/60)}:${timer % 60 < 10 ? '0' + (timer % 60) : timer % 60}` : 'Отправить код'}
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
        <button 
          type="button" 
          className="tegram-code-btn" 
          onClick={() => checkAuth()}
        >
          checkAuth
        </button>
        <p className="tegram-code__error-text">{errorText}</p>
      </div>
    </div>
  );
});

export default TelegramCodeForm;