import {combineReducers} from 'redux';
import userReducer from './userReducer';
import eventsReducer from "./eventsReducer";
import uiReducer from "./uiReducer"

export default combineReducers({
    user: userReducer,
    events: eventsReducer,
    ui: uiReducer,
});