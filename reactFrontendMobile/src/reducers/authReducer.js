import * as actionTypes from "../actions/types";
import {updateObject} from "../utils/utils";

/**
 * Initial authentication state
 *
 * @type {{loading: boolean, error: boolean, token: undefined}}
 */
const initialState = {
    token: undefined,
    loading: false,
    error: false,
};

/**
 * Authentication start handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const authStart = (state, action) => {
    return updateObject(state, {
        loading: true
    });
};

/**
 * Authentication success handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        loading: false
    });
};

/**
 * Authentication fail handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const authFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: true,
    });
};

/**
 * Logout handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const authLogout = (state, action) => {
    return updateObject(state, {
        token: undefined
    });
};

/**
 * Authentication reducer
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}|{loading: boolean, error: boolean, token: string}}
 */
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