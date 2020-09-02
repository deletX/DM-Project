import {combineReducers} from "redux";
import authReducer from "./authReducer";
import profileReducer from "./profileReducer";
import notificationReducer from "./notificationReducer";
import searchReducer from "./searchReducer";


export default combineReducers({
    auth: authReducer,
    profile: profileReducer,
    notifications: notificationReducer,
    search: searchReducer,
});