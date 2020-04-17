import * as actionTypes from "./types";

export const addAlert = (text, style) => (dispatch) => {
    dispatch({
        type: actionTypes.ADD_ALERT,
        text: text,
        style: style
    });
};

export const removeAllAlerts = () => (dispatch) => {
    dispatch({
        type: actionTypes.REMOVE_ALL_ALERTS
    });
};

export const removeAlert = (id) => (dispatch) => {
    dispatch({
        type: actionTypes.REMOVE_ALERT,
        id: id
    });
};


export const alertError = (error) => (dispatch) => {
    if (error.response) {
        dispatch(addAlert(JSON.stringify(error.response.data), "error"));
    } else {
        dispatch(addAlert(error.toString(), "error"));
    }
};

