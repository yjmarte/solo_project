import { NOTIFICATION_TYPES } from "../actions/notification.action";
import { EditData } from "../actions/global.types";

const initialState = {
  loading: false,
  data: [],
  sound: false,
};

const NotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_TYPES.GET_NOTIFICATIONS:
      return {
        ...state,
        data: action.payload,
      };
    case NOTIFICATION_TYPES.CREATE_NOTIFICATION:
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    case NOTIFICATION_TYPES.DELETE_NOTIFICATION:
      return {
        ...state,
        data: state.data.filter(
          (item) =>
            item.id !== action.payload.id || item.url !== action.payload.url
        ),
      };
    case NOTIFICATION_TYPES.UPDATE_NOTIFICATION:
      return {
        ...state,
        data: EditData(state.data, action.payload._id, action.payload),
      };
    case NOTIFICATION_TYPES.DELETE_ALL_NOTIFICATIONS:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default NotificationReducer;
