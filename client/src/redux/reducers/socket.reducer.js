import { GLOBAL_TYPES } from "../actions/global.types";

const SocketReducer = (state = [], action) => {
  switch (action.type) {
    case GLOBAL_TYPES.SOCKET:
      return action.payload;
    default:
      return state;
  }
};

export default SocketReducer;
