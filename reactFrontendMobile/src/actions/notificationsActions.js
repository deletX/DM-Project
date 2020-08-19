import {notificationEditURL, notificationListURL} from "../constants/apiurls";
import {handleError, headers} from '../utils/utils';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage'
import {
    GET_NOTIFICATIONS_SUCCESS,
    NOTIFICATION_UPDATE,
    NOTIFICATIONS_ERROR,
    NOTIFICATIONS_START,
    CLEAR_NOTIFICATIONS
} from "./types";

/**
 * Notification retrieval begun action object
 *
 * @returns {{type: string}}
 */
const start = () => (
    {
        type: NOTIFICATIONS_START
    }
);

/**
 * Notifications operation failed action object
 *
 * @returns {{type: string}}
 */
const fail = () => (
    {
        type: NOTIFICATIONS_ERROR
    }
);

/**
 * Notification retrieval success action object
 *
 * @param {[{content:string,date_time:string,id:number,read:boolean,title:string,url:string}]} notifications
 * @returns {{type: string, notifications: *}}
 */
const getSuccess = (notifications) => (
    {
        type: GET_NOTIFICATIONS_SUCCESS,
        notifications
    }
);

/**
 * Notification read operations action object
 * @param {number} id
 * @param {boolean} read
 */
const readSuccess = (id, read) => (
    {
        type: NOTIFICATION_UPDATE,
        id: id,
        read: read
    }
);


/**
 * Clear notification from app **(does NOT read all notifications)**
 *
 * @returns {function(...[*]=)}
 */
export const clearNotifications = () => {
    return async (dispatch) => {
        dispatch({type: CLEAR_NOTIFICATIONS})
    };
}

/**
 * Retrieve notification action.
 *
 * Automatically start polling notifications once each minute
 *
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export const retrieveNotifications = () => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = await AsyncStorage.getItem("access_token");
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
            .catch((error) => {
                dispatch(fail());
                handleError("Something went wrong while retrieving notifications [006]")
                return error;
            })
    };
}

/**
 * Read notification action
 *
 * @param {number} notificationId
 * @param {boolean} read
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export const readNotification = (notificationId, read = true) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = await AsyncStorage.getItem("access_token");
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
                dispatch(fail());
                handleError("Something went wrong while reading the notification [007]")
                return error;
            })
    };
}

