import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBAL_TYPES } from "./redux/actions/global.types";
import { MESSAGE_TYPES } from "./redux/actions/message.action";
import { NOTIFICATION_TYPES } from "./redux/actions/notification.action";
import { POST_TYPES } from "./redux/actions/post.action";

const spawnNotification = (body, icon, url, title) => {
  let options = {
    body,
    icon,
  };

  let n = new Notification(title, options);

  n.onclick = (e) => {
    e.preventDefault();
    window.open(url, "_blank");
  };
};

const SocketClient = () => {
  const { auth, socket, notification, online, call } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();

  // Likes
  useEffect(() => {
    socket.on("likeToClient", (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("likeToClient");
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on("unlikeToClient", (newPost) => {
      dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
    });

    return () => socket.off("unlikeToClient");
  }, [socket, dispatch]);

  // Create Notification
  useEffect(() => {
    socket.on("createNotificationToClient", (message) => {
      dispatch({
        type: NOTIFICATION_TYPES.CREATE_NOTIFICATION,
        payload: message,
      });

      spawnNotification(
        message.user.username + " " + message.text,
        message.user.avatar,
        message.url,
        "INRACT"
      );
    });
    return () => socket.off("createNotificationToClient");
  }, [socket, dispatch]);

  // Delete Notification
  useEffect(() => {
    socket.on("deleteNotificationToClient", (message) => {
      dispatch({
        type: NOTIFICATION_TYPES.DELETE_NOTIFICATION,
        payload: message,
      });
    });

    return () => socket.off("deleteNotificationToClient");
  }, [socket, dispatch]);
};

export default SocketClient;
