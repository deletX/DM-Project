import * as actionTypes from "../actions/types";
import {updateObject} from "../utils/utils";

/**
 * Auth initial state
 * @type {{loading: boolean, error: boolean, token: undefined}}
 */
const initialState = {
    token: undefined,
    loading: false,
    error: false,
};

/**
 * Auth start action reducer
 *
 * @param {state} state
 * @param {{type:string}} action
 *
 * @return {state}
 */
const authStart = (state, action) => {
    return updateObject(state, {
        loading: true
    });
};

/**
 * Auth success action reducer
 *
 * @param {state} state
 * @param {{type:string,token:string}} action
 *
 * @return {state}
 */
const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        loading: false
    });
};

/**
 * Auth fail action reducer
 *
 * @param {state} state
 * @param {{type:string}} action
 *
 * @return {state}
 */
const authFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: true,
    });
};

/**
 * Auth logout action reducer
 *
 * @param {state} state
 * @param {{type:string}} action
 *
 * @return {state}
 */
const authLogout = (state, action) => {
    return updateObject(state, {
        token: undefined
    });
};

/**
 * Auth root reducer
 *
 * @param {state} state
 * @param {{}} action
 *
 * @return {state}
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