import {combineReducers} from "redux";
import authReducer from "./authReducer";
import profileReducer from "./profileReducer";
import notificationReducer from "./notificationReducer";


// Take all the reducer and export what is called the root reducer
export default combineReducers({
    auth: authReducer,
    profile: profileReducer,
    notifications: notificationReducer,
});