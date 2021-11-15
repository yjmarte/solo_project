import { GLOBAL_TYPES } from "../actions/global.types";

const AlertReducer = (state = {}, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.ALERT:
      return action.payload;
    default:
      return state;
  }
};

export default AlertReducer;
