import {updateObject} from "../utils/utils";
import {
    CLEAR_NOTIFICATIONS,
    GET_NOTIFICATIONS_SUCCESS,
    NOTIFICATION_UPDATE,
    NOTIFICATIONS_ERROR,
    NOTIFICATIONS_START
} from "../actions/types";

const initialState = {
    loading: false,
    notifications: [],
    error: false
};

const notificationsStart = (state, action) => (
    updateObject(state, {
        loading: true
    })
);

const notificationsError = (state, action) => (
    updateObject(state, {
        loading: false,
        error: true,
    })
);

const getNotificationSuccess = (state, action) => (
    updateObject(state, {
        notifications: action.notifications
    })
);

const notificationUpdate = (state, action) => {
    let {id, read} = action;
    let index = state.notifications.findIndex((notification) => (notification.id === id));
    state.notifications[index].read = read;
    return state
};

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