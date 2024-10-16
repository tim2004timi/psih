import { Navigate, Outlet, Route } from "react-router-dom";
import AuthStore from "../../AuthStore";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const PrivateRoute = observer(() => {
  const { isAuth, isAuthInProgress } = AuthStore;

  // useEffect(() => {
  //   console.log('private', isAuth);
  // }, [isAuth]);

  if (isAuthInProgress) {
    return <div style={{textAlign: "center"}}>Checking auth...</div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
});

export default PrivateRoute;