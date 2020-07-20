import * as actionTypes from "./types";

export const addAlert = (text, style) => {
    return async (dispatch) => {
        dispatch({
            type: actionTypes.ADD_ALERT,
            text: text,
            style: style
        });
    };
}

export const removeAllAlerts = () => {
    return async (dispatch) => {
        dispatch({
            type: actionTypes.REMOVE_ALL_ALERTS
        });
    };
}

export const removeAlert = (id) => {
    return async (dispatch) => {
        dispatch({
            type: actionTypes.REMOVE_ALERT,
            id: id
        });
    };
}


export const alertError = (error) => {
    return async (dispatch) => {
        if (error.response) {
            dispatch(addAlert(JSON.stringify(error.response.data), "error"));
        } else {
            dispatch(addAlert(error.toString(), "error"));
        }
    };
}

