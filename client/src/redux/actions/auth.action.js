import { GLOBAL_TYPES } from "./global.types";
import { postAPI } from "../utilities/fetch.api";
import { toast } from "react-toastify";

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    const response = await postAPI("login", data);
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        token: response.data.access_token,
        user: response.data.user,
      },
    });

    localStorage.setItem("authToken", true);

    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        success: toast.success(response.data.message),
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: toast.error(err.response.data.message),
      },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });

    try {
      const response = await postAPI("refresh_token");
      dispatch({
        type: GLOBAL_TYPES.AUTH,
        payload: {
          token: response.data.access_token,
          user: response.data.user,
        },
      });

      dispatch({ type: GLOBAL_TYPES.ALERT, payload: {} });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: toast.error(err.response.data.message),
        },
      });
    }
  }
};

export const register = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });

    const response = await postAPI("register", data);
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        token: response.data.access_token,
        user: response.data.user,
      },
    });

    localStorage.setItem("authToken", true);
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        success: toast.success(response.data.message),
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: toast.error(err.response.data.message),
      },
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("authToken");
    await postAPI("logout");
    toast.success("Successfully logged out!");
    window.location.href = "/";
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: toast.error(err.response.data.message),
      },
    });
  }
};
