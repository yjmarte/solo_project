import { GLOBAL_TYPES, DeleteData } from "./global.types";
import { getAPI, patchAPI } from "../utilities/fetch.api";
import { uploadAvatar } from "../utilities/upload.image";
import {
  createNotification,
  deleteNotification,
} from "../actions/notification.action";
import { toast } from "react-toastify";

export const PROFILE_TYPES = {
  LOADING: "LOADING_PROFILE",
  GET_USER: "GET_PROFILE_USER",
  FOLLOW: "FOLLOW",
  UNFOLLOW: "UNFOLLOW",
  GET_ID: "GET_PROFILE_ID",
  GET_POSTS: "GET_PROFILE_POSTS",
  UPDATE_POST: "UPDATE_PROFILE_POST",
};

export const getProfileUsers =
  ({ id, auth }) =>
  async (dispatch) => {
    dispatch({ type: PROFILE_TYPES.GET_ID, payload: id });

    try {
      dispatch({ type: PROFILE_TYPES.LOADING, payload: true });

      const response = getAPI(`profile/${id}`, auth.token);
      const response1 = getAPI(`user_posts/${id}`, auth.token);

      const users = await response;
      const posts = await response1;

      dispatch({
        type: PROFILE_TYPES.GET_USER,
        payload: users.data,
      });

      dispatch({
        type: PROFILE_TYPES.GET_POSTS,
        payload: { ...posts.data, _id: id, page: 2 },
      });

      dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err.response.data.message) },
      });
    }
  };

export const updateProfileUser =
  ({ userData, avatar, auth }) =>
  async (dispatch) => {
    if (!userData.name)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error("Please add your name.") },
      });

    if (userData.name.length > 30)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error("Your name is too long.") },
      });

    if (userData.bio.length > 150)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error("Your story is too long.") },
      });

    try {
      let media;
      dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });

      if (avatar) media = await uploadAvatar([avatar]);

      const response = await patchAPI(
        "profile",
        {
          ...userData,
          avatar: avatar ? media[0].url : auth.user.avatar,
        },
        auth.token
      );

      dispatch({
        type: GLOBAL_TYPES.AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            ...userData,
            avatar: avatar ? media[0].url : auth.user.avatar,
          },
        },
      });

      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { success: toast.success(response.data.message) },
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err.response.data.message) },
      });
    }
  };

export const follow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    let newUser;

    if (users.every((item) => item._id !== user._id)) {
      newUser = { ...user, followers: [...user.followers, auth.user] };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = { ...item, followers: [...item.followers, auth.user] };
        }
      });
    }

    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser });

    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        ...auth,
        user: { ...auth.user, following: [...auth.user.following, newUser] },
      },
    });

    try {
      const response = await patchAPI(
        `profile/${user._id}/follow`,
        null,
        auth.token
      );
      socket.emit("follow", response.data.newUser);

      // Notify
      const message = {
        id: auth.user._id,
        text: "has started to follow you.",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      };

      dispatch(createNotification({ message, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err) },
      });
    }
  };

export const unfollow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    let newUser;

    if (users.every((item) => item._id !== user._id)) {
      newUser = {
        ...user,
        followers: DeleteData(user.followers, auth.user._id),
      };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = {
            ...item,
            followers: DeleteData(item.followers, auth.user._id),
          };
        }
      });
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser });

    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: DeleteData(auth.user.following, newUser._id),
        },
      },
    });

    try {
      const res = await patchAPI(
        `profile/${user._id}/unfollow`,
        null,
        auth.token
      );
      socket.emit("unfollow", res.data.newUser);

      // Notify
      const message = {
        id: auth.user._id,
        text: "has started to follow you.",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      };

      dispatch(deleteNotification({ message, auth, socket }));
    } catch (err) {
      console.log(err);
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err) },
      });
    }
  };
