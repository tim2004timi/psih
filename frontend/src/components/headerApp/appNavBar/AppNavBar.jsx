import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./appNavBar.css";

const AppNavBar = () => {
  const location = useLocation();

  return (
    <ul className="Appnavbar__container">
      <li
        className={`Appnavbar__container-li ${
          location.pathname.startsWith("/orders") ||
          location.pathname.startsWith("/products") ||
          location.pathname.startsWith("/remains") ||
          location.pathname.startsWith("/parties") ||
          location.pathname.startsWith("/neworder")
            ? "Appnavbar__container-li_active"
            : ""
        }`}
      >
        <Link className="Appnavbar__container-link" to="/orders">
          Склад
        </Link>
      </li>
      <li
        className={`Appnavbar__container-li ${
          location.pathname.startsWith("/messager")
            ? "Appnavbar__container-li_active"
            : ""
        }`}
      >
        <Link className="Appnavbar__container-link" to="/messager">
          Сообщения
        </Link>
      </li>
      <li
        className={`Appnavbar__container-li ${
          location.pathname.startsWith("/crm")
            ? "Appnavbar__container-li_active"
            : ""
        }`}
      >
        <Link className="Appnavbar__container-link" to="/crm">
          CRM
        </Link>
      </li>
      <li className={`Appnavbar__container-li`}>
        <Link className="Appnavbar__container-link" to="">
          Пользователи
        </Link>
      </li>
      <li className={`Appnavbar__container-li`}>
        <Link className="Appnavbar__container-link" to="">
          Задачи
        </Link>
      </li>
      <li className={`Appnavbar__container-li`}>
        <Link className="Appnavbar__container-link" to="">
          Аналитика
        </Link>
      </li>
    </ul>
  );
};

export default AppNavBar;
