import { GLOBAL_TYPES } from "./global.types";
import { deleteAPI, getAPI, patchAPI, postAPI } from "../utilities/fetch.api";

export const NOTIFICATION_TYPES = {
  GET_NOTIFICATIONS: "GET_NOTIFICATIONS",
  CREATE_NOTIFICATION: "CREATE_NOTIFICATION",
  UPDATE_NOTIFICATION: "UPDATE_NOTIFICATION",
  DELETE_NOTIFICATION: "DELETE_NOTIFICATION",
  UPDATE_SOUND: "UPDATE_SOUND",
  DELETE_ALL_NOTIFICATIONS: "DELETE_ALL_NOTIFICATIONS",
};

export const createNotification =
  ({ message, auth, socket }) =>
  async (dispatch) => {
    try {
      const response = await postAPI("notification", message, auth.token);

      socket.emit("CreateNotification", {
        ...response.data.notification,
        user: {
          username: auth.user.username,
          avatar: auth.user.avatar,
        },
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.message },
      });
    }
  };

  export const getNotifications = (token) => async (dispatch) => {
      try {
          const response = await getAPI('notifications', token)

          dispatch({ type: NOTIFICATION_TYPES.GET_NOTIFICATIONS, payload: response.data.notifications })
      } catch (err) {
          dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: err.response.data.message }})
      }
  }

  export const readNotification = ({ message, auth }) => async (dispatch) => {
      dispatch({ type: NOTIFICATION_TYPES.UPDATE_NOTIFICATION, payload: { ...message, read: true }})

      try {
          await patchAPI(`/notification/${message._id}`, null, auth.token)
      } catch (err) {
          dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: err.response.data.message }})
      }
  }

  export const deleteNotification = ({ message, auth, socket }) => async (dispatch) => {
      try {
          await deleteAPI(`notification/${message.id}?url=${message.url}`, auth.token)

          socket.emit('deleteNotification', message)
      } catch (err) {
          dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: err.response.data.message }})
      }
  }

  export const deleteAllNotifications = (token) => async (dispatch) => {
      dispatch({ type: NOTIFICATION_TYPES.DELETE_ALL_NOTIFICATIONS, payload: []})
      try {
          await deleteAPI('deleteAllNotifications', token)
      } catch (err) {
          dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: err.response.data.message }})
      }
  }