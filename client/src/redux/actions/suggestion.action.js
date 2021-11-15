import { GLOBAL_TYPES } from "./global.types";
import { getAPI } from "../utilities/fetch.api";
import { toast } from "react-toastify";

export const SUGGESTION_TYPES = {
  LOADING: "LOADING_SUGGESTIONS",
  GET_USERS: "GET_SUGGESTED_USERS",
};

export const getSuggestions = (token) => async (dispatch) => {
  try {
    dispatch({ type: SUGGESTION_TYPES.LOADING, payload: true });

    const response = await getAPI("suggestions", token);
    dispatch({ type: SUGGESTION_TYPES.GET_USERS, payload: response.data });

    dispatch({ type: SUGGESTION_TYPES.LOADING, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: toast.error(err.response.data.message) },
    });
  }
};
