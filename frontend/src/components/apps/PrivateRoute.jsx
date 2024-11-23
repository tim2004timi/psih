import { Navigate, Outlet, Route } from "react-router-dom";
import AuthStore from "../../AuthStore";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Loader from "../loader/Loader";

const PrivateRoute = observer(() => {
  const { isAuth, isAuthInProgress } = AuthStore;

  // useEffect(() => {
  //   console.log('private', isAuth);
  // }, [isAuth]);

  if (isAuthInProgress) {
    return <div style={{textAlign: "center"}}><Loader /></div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
});

export default PrivateRoute;