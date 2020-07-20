import * as actionTypes from "../actions/types";
import {updateObject} from "../../utils";

const initialState = {
    token: undefined,
    loading: false,
    error: false,
};

const authStart = (state, action) => {
    return updateObject(state, {
        loading: true
    });
};

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        loading: false
    });
};

const authFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: true,
    });
};

const authLogout = (state, action) => {
    return updateObject(state, {
        token: undefined
    });
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(state, action);
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action);
        case actionTypes.AUTH_ERROR:
            return authFail(state, action);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state, action);
        default:
            return state;
    }
};

export default authReducer;