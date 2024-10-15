import { Navigate, Outlet, Route } from "react-router-dom";
import AuthStore from "../../AuthStore";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const PrivateRoute = observer((props) => {
  const { isAuth, isLoadingAuth } = AuthStore;

  if (isLoadingAuth) {
    return <div>Checking auth...</div>;
  }
  if (isAuth) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
});

export default PrivateRoute;
