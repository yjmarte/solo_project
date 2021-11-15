import { Redirect, Route } from "react-router-dom";

const PrivateRoute = (props) => {
  const authToken = localStorage.getItem("authToken");

  return authToken ? <Route {...props} /> : <Redirect to="/login" />;
};

export default PrivateRoute;
