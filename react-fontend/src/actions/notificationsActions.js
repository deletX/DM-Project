import {notificationEditURL, notificationListURL} from "../constants/apiurls";
import {headers} from "../utils/utils";
import {alertError} from "./alertActions";
import axios from "axios";
import {
    GET_NOTIFICATIONS_SUCCESS,
    NOTIFICATION_UPDATE,
    NOTIFICATIONS_ERROR,
    NOTIFICATIONS_START,
    CLEAR_NOTIFICATIONS
} from "./types";

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
        return axios
            .get(
                notificationListURL(),
                headers('application/json', access_token)
            )
            .then(res => {
                dispatch(getSuccess(res.data))
                setTimeout(() => {
                    retrieveNotifications()
                }, 60)
            })
            .catch(error => {
                dispatch(alertError(error));
                dispatch(fail());
                return error;
            })
    };
}

export const readNotification = (notificationId, read = true) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        return axios
            .put(
                notificationEditURL(notificationId),
                {
                    read: read
                },
                headers('application/json', access_token)
            )
            .then(res => {
                dispatch(readSuccess(notificationId, read))
            })
            .catch(error => {
                dispatch(alertError(error));
                dispatch(fail());
                return error;
            })
    };
}

