import React from "react";
import "./AdminPage.css";
import { Link } from "react-router-dom";
import userImg from '../../../assets/img/admin_page_user_img.png';
import userLogout from '../../../assets/img/admin_page_user_logout.png';

const AdminPage = () => {
  return (
    <>
      {/* <div className="admin-page-user">
        <div className="admin-page-user__header">
            <div className="admin-page-user__login">
                <img src={userImg} alt="userImg" className="admin-page-user__login-img" />
                <p className="admin-page-user__login-text">Nikitan</p>
            </div>
            <button className="admin-page-user__logout">
                <img src={userLogout} alt="userLogout" className="admin-page-user__logout-img" />
            </button>
        </div>
        <div className="admin-page-management__login">
            <p className="admin-page-management__login-title">Логин</p>
            <p className="admin-page-management__login-content">Nikitan</p>
          </div>
          <div className="admin-page-management__email">
            <p className="admin-page-management__email-title">Telegram</p>
            <p className="admin-page-management__email-content">
              nnn202@gmail.com
            </p>
          </div>
      </div> */}
      <div className="admin-page-management">
        <div className="admin-page-management__item">
          <div className="admin-page-management__item-header">
            <h3 className="admin-page-management__item-title">Сотрудник</h3>
            <label class="toggle">
              <input class="toggle-checkbox" type="checkbox" />
              <div class="toggle-switch"></div>
            </label>
          </div>
          <div className="admin-page-management__switch">
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">Склад</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">Сообщения</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">CRM</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">Аналитика</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
          </div>
          <div className="admin-page-management__login">
            <p className="admin-page-management__login-title">Логин</p>
            <p className="admin-page-management__login-content">Nikitan</p>
          </div>
          <div className="admin-page-management__email">
            <p className="admin-page-management__email-title">Telegram</p>
            <p className="admin-page-management__email-content">
              nnn202@gmail.com
            </p>
          </div>
          <Link className="admin-page-management__link">Перейти</Link>
        </div>
        <div className="admin-page-management__item">
          <div className="admin-page-management__item-header">
            <h3 className="admin-page-management__item-title">Сотрудник</h3>
            <label class="toggle">
              <input class="toggle-checkbox" type="checkbox" />
              <div class="toggle-switch"></div>
            </label>
          </div>
          <div className="admin-page-management__switch">
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">Склад</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">Сообщения</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">CRM</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">Аналитика</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
          </div>
          <div className="admin-page-management__login">
            <p className="admin-page-management__login-title">Логин</p>
            <p className="admin-page-management__login-content">Nikitan</p>
          </div>
          <div className="admin-page-management__email">
            <p className="admin-page-management__email-title">Telegram</p>
            <p className="admin-page-management__email-content">
              nnn202@gmail.com
            </p>
          </div>
          <Link className="admin-page-management__link">Перейти</Link>
        </div>
        <div className="admin-page-management__item">
          <div className="admin-page-management__item-header">
            <h3 className="admin-page-management__item-title">Сотрудник</h3>
            <label class="toggle">
              <input class="toggle-checkbox" type="checkbox" />
              <div class="toggle-switch"></div>
            </label>
          </div>
          <div className="admin-page-management__switch">
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">Склад</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">Сообщения</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">CRM</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
            <div className="admin-page-management__switch-item">
              <p className="admin-page-management__switch-text">Аналитика</p>
              <label class="toggle">
                <input class="toggle-checkbox" type="checkbox" />
                <div class="toggle-switch"></div>
              </label>
            </div>
          </div>
          <div className="admin-page-management__login">
            <p className="admin-page-management__login-title">Логин</p>
            <p className="admin-page-management__login-content">Nikitan</p>
          </div>
          <div className="admin-page-management__email">
            <p className="admin-page-management__email-title">Telegram</p>
            <p className="admin-page-management__email-content">
              nnn202@gmail.com
            </p>
          </div>
          <Link className="admin-page-management__link">Перейти</Link>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
