import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import moment from "moment";
import {
  readNotification,
  NOTIFICATION_TYPES,
  deleteAllNotifications,
} from "../redux/actions/notification.action";
import { Row, Stack } from "react-bootstrap";
import NoNotifications from "../images/notification.png";
import { XCircle, XCircleFill } from 'react-bootstrap-icons'

const NotificationModal = () => {
  const { auth, notification } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleRead = (message) => {
    dispatch(readNotification({ message, auth }));
  };

  const handleDeleteAll = () => {
    const newArr = notification.data.filter((item) => item.read === false);
    if (newArr.length === 0)
      return dispatch(deleteAllNotifications(auth.token));

    if (
      window.confirm(
        `Are you sure you want to delete ${newArr.length} unread notifications?`
      )
    ) {
      return dispatch(deleteAllNotifications(auth.token));
    }
  };
  return (
    <>
      <Row className="d-flex justify-content-between align-items-center px-3 pb-3">
        <h4>Notifications</h4>
        {notification.data.length === 0 && (
          <XCircle size={72} className="mt-2 mb-3" />
        )}
        <Stack>
          {notification.data.map((message, index) => (
            <Row key={index} className="px-2 mb-3">
              <Link
                to={`${message.url}`}
                className="d-flex text-dark align-items-center"
                onClick={() => handleRead(message)}
              >
                <Avatar src={message.user.avatar} size="big-avatar" />
                <Row className="mx-1 flex-fill">
                  <strong className="mr-1">{message.user.name}</strong>
                  <span>{message.text}</span>
                  {message.content && (
                    <small>{message.content.slice(0, 20)}...</small>
                  )}
                </Row>

                {message.image && (
                  <Row>
                    {message.image.match(/video/i) ? (
                      <video src={message.image} width="100%" />
                    ) : (
                      <Avatar src={message.image} size="medium-avatar" />
                    )}
                  </Row>
                )}
              </Link>

              <small className="text-muted d-flex justify-content-between px-2">
                {moment(message.createdAt).fromNow()}
                {!message.read && <i className="fas fa-circle text-primary" />}
              </small>
            </Row>
          ))}
        </Stack>

        <hr className="my-1" />

        <Row
          className="text-right text-danger ms-1"
          style={{ cursor: "pointer" }}
          onClick={handleDeleteAll}
        >
          Delete All Notifications
        </Row>
      </Row>
    </>
  );
};

export default NotificationModal;
