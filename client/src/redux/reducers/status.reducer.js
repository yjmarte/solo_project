import { GLOBAL_TYPES } from "../actions/global.types";

const StatusReducer = (state = false, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.STATUS:
      return action.payload;
    default:
      return state;
  }
};

export default StatusReducer;
