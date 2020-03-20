import {
    UI_JOIN_SUCCESS_ALERT,
    UI_JOIN_ERROR_ALERT,
    UI_JOIN_SUCCESS_ALERT_HIDE,
    UI_JOIN_ERROR_ALERT_HIDE,
    UI_CREATE_SUCCESS_ALERT,
    UI_CREATE_SUCCESS_ALERT_HIDE,
    UI_CREATE_ERROR_ALERT,
    UI_CREATE_ERROR_ALERT_HIDE
} from "./types";

/**
 * Action
 * dispatch the show of a SuccessAlert in EventTableContainer
 */
export const showJoinSuccessAlert = () => dispatch => {
    dispatch({type: UI_JOIN_SUCCESS_ALERT});
};

/**
 * Action
 * dispatch the show of an ErrorAlert in EventJoinComponent
 *
 */
export const showJoinErrorAlert = () => dispatch => {
    dispatch({type: UI_JOIN_ERROR_ALERT});
};

/**
 * Action
 * dispatch the hiding of the SuccessAlert
 *
 */
export const hideJoinSuccessAlert = () => dispatch => {
    dispatch({type: UI_JOIN_SUCCESS_ALERT_HIDE});
};

/**
 * Action
 * dispatch the hiding of the ErrorAlert
 *
 */
export const hideJoinErrorAlert = () => dispatch => {
    dispatch({type: UI_JOIN_ERROR_ALERT_HIDE});
};

export const showCreateSuccessAlert = () => dispatch => {
    dispatch({type: UI_CREATE_SUCCESS_ALERT});
};

export const hideCreateSuccessAlert = () => dispatch => {
    dispatch({type: UI_CREATE_SUCCESS_ALERT_HIDE});
};

export const showCreateErrorAlert = () => dispatch => {
    dispatch({type: UI_CREATE_ERROR_ALERT});
};

export const hideCreateErrorAlert = () => dispatch => {
    dispatch({type: UI_CREATE_ERROR_ALERT_HIDE});
};