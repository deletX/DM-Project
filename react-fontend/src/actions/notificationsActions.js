import {alertError} from "./alertActions";
import {
    GET_NOTIFICATIONS_SUCCESS,
    NOTIFICATION_UPDATE,
    NOTIFICATIONS_ERROR,
    NOTIFICATIONS_START,
    CLEAR_NOTIFICATIONS
} from "./types";
import {getNotifications, putReadNotifications} from "../utils/api";

const start = () => (
    {
        type: NOTIFICATIONS_START
    }
);

const fail = () => (
    {
        type: NOTIFICATIONS_ERROR
    }
);

const getSuccess = (notifications) => (
    {
        type: GET_NOTIFICATIONS_SUCCESS,
        notifications
    }
);

/**
 *
 * @param id
 * @param {boolean} read
 */
const readSuccess = (id, read) => (
    {
        type: NOTIFICATION_UPDATE,
        id: id,
        read: read
    }
);


export const clearNotifications = () => {
    return async (dispatch) => {
        dispatch({type: CLEAR_NOTIFICATIONS})
    };
}

export const retrieveNotifications = () => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        return getNotifications(access_token,
            (res) => {
                dispatch(getSuccess(res.data))
                setTimeout(() => {
                    retrieveNotifications()
                }, 60)
            },
            (err) => {
                dispatch(alertError(err));
                dispatch(fail());
                return err;
            })
    };
}

export const readNotification = (notificationId, read = true) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        return putReadNotifications(access_token,notificationId,read,
            (res) => {
                dispatch(readSuccess(notificationId, read))
            },
            (err) => {
                dispatch(alertError(err));
                dispatch(fail());
                return err;
            })
    };
}

