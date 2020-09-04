import {
    CLEAR_NOTIFICATIONS,
    GET_NOTIFICATIONS_SUCCESS,
    NOTIFICATION_UPDATE,
    NOTIFICATIONS_ERROR,
    NOTIFICATIONS_START
} from "./types";
import {getNotifications, putReadNotifications} from "../utils/api";
import {handleError} from "../utils/utils";

/**
 * Start action
 *
 * @return {{type: string}}
 */
const start = () => (
    {
        type: NOTIFICATIONS_START
    }
);

/**
 * Fail action
 *
 * @return {{type: string}}
 */
const fail = () => (
    {
        type: NOTIFICATIONS_ERROR
    }
);

/**
 * Notification retrieval action
 *
 * @param {[]} notifications
 *
 * @return {{type: string, notifications: []}}
 */
const getSuccess = (notifications) => (
    {
        type: GET_NOTIFICATIONS_SUCCESS,
        notifications
    }
);

/**
 * Notification update action
 *
 * @param {number} id
 * @param {boolean} read
 *
 * @return {{type:string,id:number,read:boolean}}
 */
const readSuccess = (id, read) => (
    {
        type: NOTIFICATION_UPDATE,
        id: id,
        read: read
    }
);

/**
 * Dispatches the clear notifications action
 *
 * @return {function(*): Promise<void>}
 */
export const clearNotifications = () => {
    return async (dispatch) => {
        dispatch({type: CLEAR_NOTIFICATIONS})
    };
}

/**
 * Execute the api call and dispatches either the retrieve notification action or the fail action
 *
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
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
                handleError(enqueueSnackbar, "Something went wrong while retrieving your notifications [023]", err)
                dispatch(fail());
                return err;
            })
    };
}

/**
 * Execute the api call to update notification read status and dispatches either the read notification action or
 * the fail action
 *
 * @param {number} notificationId
 * @param {boolean} read
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const readNotification = (notificationId, read = true, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        return putReadNotifications(access_token, notificationId, read,
            (res) => {
                dispatch(readSuccess(notificationId, read))
            },
            (err) => {
                handleError(enqueueSnackbar, "Something went wrong while reading the notifications [024]", err)
                dispatch(fail());
                return err;
            })
    };
}

