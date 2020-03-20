import {
    UI_JOIN_SUCCESS_ALERT,
    UI_JOIN_SUCCESS_ALERT_HIDE,
    UI_JOIN_ERROR_ALERT,
    UI_JOIN_ERROR_ALERT_HIDE,
    UI_CREATE_SUCCESS_ALERT,
    UI_CREATE_SUCCESS_ALERT_HIDE, UI_CREATE_ERROR_ALERT, UI_CREATE_ERROR_ALERT_HIDE
} from "../actions/types";

const initialState = {
    showJoinSuccessAlert: false,
    showJoinErrorAlert: false,

    showCreateSuccessAlert: false,
    showCreateErrorAlert: false,

};

export default function (state = initialState, action) {
    switch (action.type) {
        case UI_JOIN_SUCCESS_ALERT:
            return {...state, showJoinSuccessAlert: true};
        case UI_JOIN_SUCCESS_ALERT_HIDE:
            return {...state, showJoinSuccessAlert: false};
        case UI_JOIN_ERROR_ALERT:
            return {...state, showJoinErrorAlert: true};
        case UI_JOIN_ERROR_ALERT_HIDE:
            return {...state, showJoinErrorAlert: false};


        case UI_CREATE_SUCCESS_ALERT:
            return {...state, showCreateSuccessAlert: true};
        case UI_CREATE_SUCCESS_ALERT_HIDE:
            return {...state, showCreateSuccessAlert: false};
        case UI_CREATE_ERROR_ALERT:
            return {...state, showCreateErrorAlert: true};
        case UI_CREATE_ERROR_ALERT_HIDE:
            return {...state, showCreateErrorAlert: false};

        default:
            return state;
    }

}