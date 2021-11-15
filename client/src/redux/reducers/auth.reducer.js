import { GLOBAL_TYPES } from "../actions/global.types";

const AuthReducer = (state = {}, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.AUTH:
      return action.payload;
    default:
      return state;
  }
};

export default AuthReducer;
