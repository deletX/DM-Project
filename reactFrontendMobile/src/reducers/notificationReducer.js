import {updateObject} from "../utils/utils";
import {
    CLEAR_NOTIFICATIONS,
    GET_NOTIFICATIONS_SUCCESS,
    NOTIFICATION_UPDATE,
    NOTIFICATIONS_ERROR,
    NOTIFICATIONS_START
} from "../actions/types";

/**
 * Initial notification state
 *
 * @type {{loading: boolean, error: boolean, notifications: []}}
 */
const initialState = {
    loading: false,
    notifications: [],
    error: false,
    unReadCount: 0
};

/**
 * Notification operation start handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const notificationsStart = (state, action) => (
    updateObject(state, {
        loading: true
    })
);

/**
 * Notification operation error handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const notificationsError = (state, action) => (
    updateObject(state, {
        loading: false,
        error: true,
    })
);

/**
 * Notification retrieval success handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const getNotificationSuccess = (state, action) => (
    updateObject(state, {
        notifications: action.notifications,
        unReadCount: action.notifications.filter(item => (!item.read)).length
    })
);

/**
 * Notification edit handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const notificationUpdate = (state, action) => {
    let {id, read} = action;
    let tmpState = {...state};
    if (read){
        tmpState.unReadCount -= 1;
    } else {
        tmpState.unReadCount += 1;
    }
    let index = state.notifications.findIndex((notification) => (notification.id === id));
    tmpState.notifications[index].read = read;
    return tmpState
};

/**
 * Notification reducer
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{loading: boolean, error: boolean, notifications: *[]}|{}|*}
 */
const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFICATIONS_START:
            return notificationsStart(state, action);
        case NOTIFICATIONS_ERROR:
            return notificationsError(state, action);
        case GET_NOTIFICATIONS_SUCCESS:
            return getNotificationSuccess(state, action);
        case NOTIFICATION_UPDATE:
            return notificationUpdate(state, action);
        case CLEAR_NOTIFICATIONS:
            return initialState;
        default:
            return state;
    }
};

export default notificationReducer;