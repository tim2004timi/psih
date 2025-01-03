import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import { Link } from "react-router-dom";
import userImg from "../../../assets/img/admin_page_user_img.png";
import userLogout from "../../../assets/img/admin_page_user_logout.png";
import AuthStore from "../../../AuthStore";
import { useNavigate } from "react-router-dom";
import UserStore from "../../../UserStore";
import { observer } from "mobx-react-lite";
import NotificationManager from "../../notificationManager/NotificationManager";

const ProfilePage = observer(() => {
  const { logout } = AuthStore;
  const {
    currentUser,
    getCurrentUser,
    usersArr,
    getUsers,
    patchUser,
    createUser,
    errorText,
  } = UserStore;
  const navigate = useNavigate();

  const [toggleStates, setToggleStates] = useState({});
  const [newUserState, setNewUserState] = useState({
    access_storage: false,
    access_crm: false,
    access_message: false,
    access_analytics: false,
    username: "",
    tg_username: "",
    password: "",
  });
  const [isShowPasswordPopup, setIsShowPasswordPopup] = useState(false);
  const [isShowNewUserPopup, setIsShowNewUserPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [profilePageErrorText, setProfilePageErrorText] = useState("");

  const logoutOfSystem = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    getCurrentUser();
    getUsers();
  }, []);

  useEffect(() => {
    setProfilePageErrorText(errorText);
  }, [errorText]);

  useEffect(() => {
    const initialToggleStates = usersArr.reduce((acc, user) => {
      acc[user.id] = {
        access_analytics: user.access_analytics,
        access_crm: user.access_crm,
        access_message: user.access_message,
        access_storage: user.access_storage,
        active: user.active,
      };
      return acc;
    }, {});

    setToggleStates(initialToggleStates);
  }, [usersArr]);

  const handleToggleChange = (userId, toggleName, checked) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [userId]: {
        ...prevState[userId],
        [toggleName]: checked,
      },
    }));

    patchUser(userId, { [toggleName]: checked });
  };

  const handleNewUserToggleChange = (toggleName, checked) => {
    setNewUserState((prevState) => ({
      ...prevState,
      [toggleName]: checked,
    }));
  };

  const resetProfilePageErrorText =() => {
    setProfilePageErrorText('')
  }

  const listOfEmployees = () => {
    return (
      <div className="admin-page-management">
        {usersArr.map((user) => (
          <div className="admin-page-management__item" key={user.id}>
            <div className="admin-page-management__item-header">
              <h3 className="admin-page-management__item-title">Сотрудник</h3>
              <label className="toggle">
                <input
                  className="toggle-checkbox"
                  type="checkbox"
                  checked={toggleStates[user.id]?.active || false}
                  onChange={(e) =>
                    handleToggleChange(user.id, "active", e.target.checked)
                  }
                />
                <div className="toggle-switch"></div>
              </label>
            </div>
            <div className="admin-page-management__switch">
              <div className="admin-page-management__switch-item">
                <p className="admin-page-management__switch-text">Склад</p>
                <label className="toggle">
                  <input
                    className="toggle-checkbox"
                    type="checkbox"
                    checked={toggleStates[user.id]?.access_storage || false}
                    onChange={(e) =>
                      handleToggleChange(
                        user.id,
                        "access_storage",
                        e.target.checked
                      )
                    }
                  />
                  <div className="toggle-switch"></div>
                </label>
              </div>
              <div className="admin-page-management__switch-item">
                <p className="admin-page-management__switch-text">Сообщения</p>
                <label className="toggle">
                  <input
                    className="toggle-checkbox"
                    type="checkbox"
                    checked={toggleStates[user.id]?.access_message || false}
                    onChange={(e) =>
                      handleToggleChange(
                        user.id,
                        "access_message",
                        e.target.checked
                      )
                    }
                  />
                  <div className="toggle-switch"></div>
                </label>
              </div>
              <div className="admin-page-management__switch-item">
                <p className="admin-page-management__switch-text">CRM</p>
                <label className="toggle">
                  <input
                    className="toggle-checkbox"
                    type="checkbox"
                    checked={toggleStates[user.id]?.access_crm || false}
                    onChange={(e) =>
                      handleToggleChange(
                        user.id,
                        "access_crm",
                        e.target.checked
                      )
                    }
                  />
                  <div className="toggle-switch"></div>
                </label>
              </div>
              <div className="admin-page-management__switch-item">
                <p className="admin-page-management__switch-text">Аналитика</p>
                <label className="toggle">
                  <input
                    className="toggle-checkbox"
                    type="checkbox"
                    checked={toggleStates[user.id]?.access_analytics || false}
                    onChange={(e) =>
                      handleToggleChange(
                        user.id,
                        "access_analytics",
                        e.target.checked
                      )
                    }
                  />
                  <div className="toggle-switch"></div>
                </label>
              </div>
            </div>
            <div className="admin-page-management__login">
              <p className="admin-page-management__login-title">Логин</p>
              <p className="admin-page-management__login-content">
                {user.username}
              </p>
            </div>
            <div className="admin-page-management__email">
              <p className="admin-page-management__email-title">Telegram</p>
              <p className="admin-page-management__email-content">
                {user.tg_username}
              </p>
            </div>
            <Link className="admin-page-management__link">Перейти</Link>
          </div>
        ))}
      </div>
    );
  };

  const checkPassword = (password, repeatPassword) => {
    if (password === repeatPassword) {
      patchUser(currentUser.id, { ["password"]: password });
    } else {
      setProfilePageErrorText("Пароли не совпадают!");
    }

    setIsShowPasswordPopup(false);
  };

  // useEffect(() => {
  //   if (profilePageErrorText) {
  //     console.log(profilePageErrorText);
  //   }
  // }, [profilePageErrorText]);

  const passwordPopup = () => {
    return (
      <div className="admin-page-user-popup">
        <input
          type="text"
          className="admin-page-user-popup__input"
          placeholder="Новый пароль"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          className="admin-page-user-popup__input"
          placeholder="Повторите пароль"
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <div className="admin-page-user-popup__btn">
          <button
            className="admin-page-user__button admin-page-user__button--p43"
            onClick={() => setIsShowPasswordPopup(false)}
          >
            Отмена
          </button>
          <button
            className="admin-page-user__button admin-page-user__button--p30"
            onClick={() => checkPassword(password, repeatPassword)}
          >
            Сохранить
          </button>
        </div>
      </div>
    );
  };

  const isImportantFieldsFilled = (currentUserState) => {
    const newFieldValidity = {
      username: currentUserState.username !== '',
      tg_username: currentUserState.tg_username !== '',
      password: currentUserState.password !== '',
    };
  
    return Object.values(newFieldValidity).every(isValid => isValid);
  }

  const createNewUser = async(newUserState) => {
    if (!isImportantFieldsFilled(newUserState)) {
      setProfilePageErrorText('Заполните необходимые поля!');
      return;
    }

    await createUser(newUserState);
    setIsShowNewUserPopup(false);
    getUsers();
    setNewUserState({
      access_storage: false,
      access_crm: false,
      access_message: false,
      access_analytics: false,
      username: "",
      tg_username: "",
      password: "",
    })
  }

  const newUserPopup = () => {
    return (
      <form className="admin-page-user-popup">
        <input
          type="text"
          className="admin-page-user-popup__input"
          placeholder="Логин"
          value={newUserState.username}
          required
          onChange={(e) =>
            setNewUserState((prevState) => ({
              ...prevState,
              username: e.target.value,
            }))
          }
        />
        <input
          type="text"
          className="admin-page-user-popup__input"
          placeholder="Телеграм @username"
          value={newUserState.tg_username}
          required
          onChange={(e) =>
            setNewUserState((prevState) => ({
              ...prevState,
              tg_username: e.target.value,
            }))
          }
        />
        <input
          type="text"
          className="admin-page-user-popup__input"
          placeholder="Пароль"
          value={newUserState.password}
          required
          onChange={(e) =>
            setNewUserState((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
        />
        <div className="admin-page-newUser__switch">
          <div className="admin-page-management__switch-item">
            <p className="admin-page-management__switch-text">Склад</p>
            <label className="toggle">
              <input
                className="toggle-checkbox"
                type="checkbox"
                checked={newUserState.access_storage || false}
                onChange={(e) =>
                  handleNewUserToggleChange("access_storage", e.target.checked)
                }
              />
              <div className="toggle-switch"></div>
            </label>
          </div>
          <div className="admin-page-management__switch-item">
            <p className="admin-page-management__switch-text">Сообщения</p>
            <label className="toggle">
              <input
                className="toggle-checkbox"
                type="checkbox"
                checked={newUserState.access_message || false}
                onChange={(e) =>
                  handleNewUserToggleChange("access_message", e.target.checked)
                }
              />
              <div className="toggle-switch"></div>
            </label>
          </div>
          <div className="admin-page-management__switch-item">
            <p className="admin-page-management__switch-text">CRM</p>
            <label className="toggle">
              <input
                className="toggle-checkbox"
                type="checkbox"
                checked={newUserState.access_crm || false}
                onChange={(e) =>
                  handleNewUserToggleChange("access_crm", e.target.checked)
                }
              />
              <div className="toggle-switch"></div>
            </label>
          </div>
          <div className="admin-page-management__switch-item">
            <p className="admin-page-management__switch-text">Аналитика</p>
            <label className="toggle">
              <input
                className="toggle-checkbox"
                type="checkbox"
                checked={newUserState.access_analytics || false}
                onChange={(e) =>
                  handleNewUserToggleChange(
                    "access_analytics",
                    e.target.checked
                  )
                }
              />
              <div className="toggle-switch"></div>
            </label>
          </div>
          <div className="admin-page-user-popup__btn">
            <button
              className="admin-page-user__button admin-page-user__button--p43"
              onClick={() => setIsShowNewUserPopup(false)}
            >
              Отмена
            </button>
            <button
              type="button"
              className="admin-page-user__button admin-page-user__button--p30"
              onClick={(e) => {
                // console.log(newUserState)
                createNewUser(newUserState)
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <>
      <div className="admin-page-user">
        <div className="admin-page-user__wrapper">
          <div className="admin-page-user__login">
            <img
              src={userImg}
              alt="userImg"
              className="admin-page-user__login-img"
            />
            <p className="admin-page-user__login-text">
              {currentUser.username}
            </p>
          </div>
          <button
            className="admin-page-user__logout"
            onClick={() => logoutOfSystem()}
          >
            <img
              src={userLogout}
              alt="userLogout"
              className="admin-page-user__logout-img"
            />
          </button>
        </div>
        <div className="admin-page-user__back-btn">
          <Link to={-1}>
            <button className="back-btn__btn">
              <div className="back-btn__arrow"></div>
            </button>
          </Link>
        </div>
        <div className="admin-page-user__wrapper">
          <div className="admin-page-user__login">
            <p className="admin-page-management__login-title">Логин</p>
            <p className="admin-page-management__login-content">
              {currentUser.username}
            </p>
          </div>
          <button
            className="admin-page-user__button"
            onClick={() => setIsShowPasswordPopup(!isShowPasswordPopup)}
          >
            изменить пароль
          </button>
        </div>
        {isShowPasswordPopup && passwordPopup()}
        <div className="admin-page-user__wrapper">
          <div className="admin-page-user__email">
            <p className="admin-page-management__email-title">Telegram</p>
            <p className="admin-page-management__email-content">
              {currentUser.tg_username}
            </p>
          </div>
          <button
            className="admin-page-user__button"
            onClick={() => setIsShowNewUserPopup(!isShowNewUserPopup)}
          >
            + добавить сотрудника
          </button>
        </div>
        {isShowNewUserPopup && newUserPopup()}
        {/* <div className="admin-page-user__wrapper">
          <div className="admin-page-user__email">
            <p className="admin-page-management__email-title">Telegram</p>
            <p className="admin-page-management__email-content">
              {currentUser.tg_username}
            </p>
          </div>
          <button
            className="admin-page-user__button"
            onClick={() => setIsShowNewUserPopup(!isShowNewUserPopup)}
          >
            + добавить сотрудника
          </button>
        </div>
        {isShowNewUserPopup && newUserPopup()} */}
      </div>
      {currentUser.admin && listOfEmployees()}
      {profilePageErrorText && (
        <NotificationManager errorMessage={profilePageErrorText} resetFunc={resetProfilePageErrorText}/>
      )}
    </>
  );
});

export default ProfilePage;
