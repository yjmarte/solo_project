import { GLOBAL_TYPES } from "../actions/global.types";

const ThemeReducer = (state = false, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.THEME:
      return action.payload;
    default:
      return state;
  }
};

export default ThemeReducer;
