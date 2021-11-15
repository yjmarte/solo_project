import { GLOBAL_TYPES } from "./global.types";
import { uploadImage } from "../utilities/upload.image";
import { postAPI, getAPI, patchAPI, deleteAPI } from "../utilities/fetch.api";
import { createNotification, deleteNotification } from "./notification.action";
import { toast } from "react-toastify";

export const POST_TYPES = {
  CREATE_POST: "CREATE_POST",
  LOADING_POST: "LOADING_POST",
  GET_POST: "GET_POST",
  GET_POSTS: "GET_POSTS",
  UPDATE_POST: "UPDATE_POST",
  DELETE_POST: "DELETE_POST",
};

export const createPost =
  ({ content, images, auth, socket }) =>
  async (dispatch) => {
    let media = [];
    try {
      dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
      if (images.length > 0) media = await uploadImage(images);

      const response = await postAPI(
        "posts",
        { content, images: media },
        auth.token
      );

      dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: false } });

      // Notification
      const message = {
        id: response.data.newPost._id,
        text: "added a new post.",
        recipients: response.data.newPost.user.followers,
        url: `/post/${response.data.newPost._id}`,
        content,
        image: media[0].url,
      };
      dispatch(createNotification({ message, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err.response.data.message) },
      });
    }
  };

export const getPosts = (token) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES.LOADING_POST, payload: true });
    const response = await getAPI("posts", token);

    dispatch({
      type: POST_TYPES.GET_POSTS,
      payload: {
        ...response.data,
        page: 2,
      },
    });

    dispatch({ type: POST_TYPES.LOADING_POST, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: toast.error(err.response.data.message) },
    });
  }
};

export const updatePost =
  ({ content, images, auth, status }) =>
  async (dispatch) => {
    let media = [];
    const imageNewUrl = images.filter((image) => !image.url);
    const imageUrl = images.filter((image) => image.url);

    if (
      status.content === content &&
      imageNewUrl.length === 0 &&
      imageUrl.length === status.images.length
    )
      return;

    try {
      dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });

      if (imageNewUrl.length > 0) media = await uploadImage(imageNewUrl);

      const response = await patchAPI(
        `post/${status._id}`,
        {
          content,
          images: [...imageUrl, ...media],
        },
        auth.token
      );

      dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: response.data.newPost,
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

export const likePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    const newPost = { ...post, likes: [...post.likes, auth.user] };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    socket.emit("likePost", newPost);

    try {
      await patchAPI(`post/${post._id}/like`, null, auth.token);

      // Notification
      const message = {
        id: auth.user._id,
        text: "liked your post.",
        recipients: [post.user._id],
        url: `post/${post._id}`,
        content: post.content,
        image: post.images[0].url,
      };

      dispatchEvent(createNotification({ message, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err.response.data.message) },
      });
    }
  };

export const unlikePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      likes: post.likes.filter((like) => like._id !== auth.user._id),
    };

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });

    socket.emit("unlikePost", newPost);

    try {
      await patchAPI(`post/${post._id}/unlike`, null, auth.token);

      // Notification
      const message = {
        id: auth.user._id,
        text: "liked your post.",
        recipients: [post.user._id],
        url: `post/${post._id}`,
      };

      dispatchEvent(deleteNotification({ message, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err.response.data.message) },
      });
    }
  };

export const getPost =
  ({ detailPost, id, auth }) =>
  async (dispatch) => {
    if (detailPost.every((post) => post._id !== id)) {
      try {
        const response = await getAPI(`post/${id}`, auth.token);
        dispatch({ type: POST_TYPES.GET_POST, payload: response.data.post });
      } catch (err) {
        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { error: toast.error(err.response.data.message) },
        });
      }
    }
  };

export const deletePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post });

    try {
      const response = await deleteAPI(`post/${post._id}`, auth.token);

      // Notification
      const message = {
        id: post._id,
        text: "added a new post.",
        recipients: response.data.newPost.user.followers,
        url: `/post/${post._id}`,
      };
      dispatch(deleteNotification({ message, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err.response.data.message) },
      });
    }
  };

export const savePost =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = { ...auth.user, saved: [...auth.user.saved, post._id] };
    dispatch({ type: GLOBAL_TYPES.AUTH, payload: { ...auth, user: newUser } });

    try {
      await patchAPI(`post/${post._id}/save`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err.response.data.nessage) },
      });
    }
  };

export const unsavePost =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = {
      ...auth.user,
      saved: auth.user.saved.filter((id) => id !== post._id),
    };
    dispatch({ type: GLOBAL_TYPES.AUTH, payload: { ...auth, user: newUser } });

    try {
      await patchAPI(`post/${post._id}/unsave`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: toast.error(err.response.data.nessage) },
      });
    }
  };
