import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { refreshToken } from "./redux/actions/auth.action";
import { getPosts } from "./redux/actions/post.action";
import { getSuggestions } from "./redux/actions/suggestion.action";
import { getNotifications } from "./redux/actions/notification.action";

import Alert from "./components/alert/Alert";
import Navigation from "./components/navbar/Navigation";
import StatusModal from "./components/StatusModal";
// import CallModal from "./components/message/CallModal";

import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Register from "./views/Register";

import PrivateRoute from "./components/routing/PrivateRoute";
import Render from "./components/routing/Render";

// import io from "socket.io-client";
import { GLOBAL_TYPES } from "./redux/actions/global.types";
// import SocketClient from "./socket.client";
// import Peer from "peerjs";

function App() {
  const { auth, status, modal, call } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());

    // const socket = io();
    // dispatch({ type: GLOBAL_TYPES.SOCKET, payload: socket });
    // return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifications(auth.token));
    }
  }, [dispatch, auth.token]);

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
        }
      });
    }
  }, []);

  // useEffect(() => {
  //   const newPeer = new Peer(undefined, {
  //     path: "/",
  //     secure: true,
  //   });
  //
  //   dispatch({ type: GLOBAL_TYPES.PEER, payload: newPeer });
  // }, [dispatch]);

  return (
    <Router>
      <Alert />

      <input type="checkbox" id="theme" />
      <Container fluid className={`inract ${(status || modal) && "mode"} g-0`}>
        <Navigation />

        {status ? <StatusModal /> : ""}
        {/* {auth.token && <SocketClient />} */}
        {/* {call && <CallModal />} */}

        <Route exact path="/" component={auth.token ? Dashboard : Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />

        <PrivateRoute exact path="/:page" component={Render} />
        <PrivateRoute exact path="/:page/:id" component={Render} />
      </Container>
    </Router>
  );
}

export default App;
