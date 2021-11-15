import { combineReducers } from "redux";
import alert from "./alert.reducer";
import auth from "./auth.reducer";
import dashboardPosts from "./post.reducer";
import modal from "./modal.reducer";
import notification from "./notification.reducer";
import postDetail from "./post.detail.reducer";
import profile from './profile.reducer'
import status from "./status.reducer";
import suggestions from './suggestion.reducer'
import theme from "./theme.reducer";

const rootReducer = combineReducers({
  alert,
  auth,
  dashboardPosts,
  modal,
  notification,
  postDetail,
  profile,
  status,
  suggestions,
  theme,
});

export default rootReducer;
