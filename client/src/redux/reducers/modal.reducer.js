import { GLOBAL_TYPES } from "../actions/global.types";

const initialState = false;

const ModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.MODAL:
      return action.payload;
    default:
      return state;
  }
};

export default ModalReducer;
