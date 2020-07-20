import {combineReducers} from "redux";
import authReducer from "./authReducer";
import alertsReducer from "./alertReducer";
import profileReducer from "./profileReducer";
import notificationReducer from "./notificationReducer";
import searchReducer from "./searchReducer";


export default combineReducers({
    auth: authReducer,
    alerts: alertsReducer,
    profile: profileReducer,
    notifications: notificationReducer,
    search: searchReducer,
});