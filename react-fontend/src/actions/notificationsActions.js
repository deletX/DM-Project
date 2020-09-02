import {
    CLEAR_NOTIFICATIONS,
    GET_NOTIFICATIONS_SUCCESS,
    NOTIFICATION_UPDATE,
    NOTIFICATIONS_ERROR,
    NOTIFICATIONS_START
} from "./types";
import {getNotifications, putReadNotifications} from "../utils/api";
import {handleError} from "../utils/utils";

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

export const retrieveNotifications = (enqueueSnackbar) => {
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
                handleError(enqueueSnackbar, "Something went wrong while retrieving your notifications", err)
                dispatch(fail());
                return err;
            })
    };
}

export const readNotification = (notificationId, read = true, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        return putReadNotifications(access_token, notificationId, read,
            (res) => {
                dispatch(readSuccess(notificationId, read))
            },
            (err) => {
                handleError(enqueueSnackbar, "Something went wrong while reading the notifications", err)
                dispatch(fail());
                return err;
            })
    };
}

