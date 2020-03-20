import {
    FETCH_EVENT, FETCH_EVENT_ERROR, FETCH_EVENT_FAILURE,
    FETCH_EVENT_SUCCESS,
    FETCH_EVENTS,
    FETCH_EVENTS_ERROR,
    FETCH_EVENTS_FAILURE,
    FETCH_EVENTS_SUCCESS, POST_EVENT,
    POST_EVENT_ERROR,
    POST_EVENT_FAILURE,
    POST_EVENT_SUCCESS, POST_PARTICIPANT,
    POST_PARTICIPANT_ERROR,
    POST_PARTICIPANT_FAILURE,
    POST_PARTICIPANT_SUCCESS, UI_CREATE_ERROR_ALERT, UI_CREATE_SUCCESS_ALERT,
    UI_JOIN_ERROR_ALERT,
    UI_JOIN_SUCCESS_ALERT
} from "./types";
import {request} from "../utils";

/**
 * Action
 * API call to fetch events
 * @returns {function(*): Promise<*>}
 */
export const fetchEvents = () => dispatch => {
    dispatch({type: FETCH_EVENTS});

    return request(
        '/api/v0.1/events/',
        (json) => {
            dispatch({type: FETCH_EVENTS_SUCCESS, payload: json})
        },
        (err) => {
            console.error(err);
            dispatch({type: FETCH_EVENTS_ERROR, payload: err})
        },
        (ex) => {
            console.error(ex);
            dispatch({type: FETCH_EVENTS_FAILURE, payload: ex})
        }
    )
};


/**
 * Action
 * API call to post a new event
 * @param {{user: number,  starting_address:string,  starting_pos: string, car:number, event:number}} participant
 * @param {string} access_token
 * @returns {function(*): Promise<*>}
 */
export const postParticipant = (participant, access_token) => dispatch => {
    dispatch({type: POST_PARTICIPANT});

    return request(
        '/api/v0.1/participants/',
        (json) => {
            dispatch({type: POST_PARTICIPANT_SUCCESS, payload: json});
            dispatch({type: UI_JOIN_SUCCESS_ALERT})
        },
        (err) => {
            console.error(err);
            err.text().then(data => {
                console.error(data)
            });
            dispatch({type: POST_PARTICIPANT_ERROR, payload: err});
            dispatch({type: UI_JOIN_ERROR_ALERT, payload: err});
        },
        (ex) => {
            console.error(ex);
            dispatch({type: POST_PARTICIPANT_FAILURE, payload: ex});
            dispatch({type: UI_JOIN_ERROR_ALERT, payload: ex});
        },
        {
            method: 'POST',
            headers: {"Authorization": `Bearer google-oauth2 ${access_token}`},
            body: JSON.stringify(participant)
        })
};

/*
id', 'name', 'description', 'address', 'destination', 'date_time', 'status', 'owner',
                  'participant_count', 'participant_set'
 */
/**
 * Action
 * API call to post a new event
 * @param {{name:string,description:string,destination:string, address:string, date_time: string}} event
 * @param {string} access_token
 * @returns {function(*): Promise<*>}
 */
export const postEvent = (event, access_token) => dispatch => {
    dispatch({type: POST_EVENT});
    return request(
        '/api/v0.1/events/',
        (json) => {
            dispatch({type: POST_EVENT_SUCCESS, payload: json});
            dispatch({type: UI_CREATE_SUCCESS_ALERT})
        },
        (err) => {
            console.error(err);
            err.text().then(data => {
                console.error(data)
            });
            dispatch({type: POST_EVENT_ERROR, payload: err});
            dispatch({type: UI_CREATE_ERROR_ALERT, payload: err});
        },
        (ex) => {
            console.error(ex);
            dispatch({type: POST_EVENT_FAILURE, payload: ex});
            dispatch({type: UI_CREATE_ERROR_ALERT, payload: ex});
        },
        {
            method: 'POST',
            headers: {"Authorization": `Bearer google-oauth2 ${access_token}`},
            body: JSON.stringify(event)
        })
};


export const fetchEvent = (event_id, access_token) => dispatch => {
    dispatch({type: FETCH_EVENT});

    return request(
        `/api/v0.1/events/${event_id}/`,
        (json) => {
            console.log(`EVENT WITH EVENT_ID ${event_id}`)
            console.log(json)
            dispatch({type: FETCH_EVENT_SUCCESS, payload: json});
        },
        (err) => {
            console.error(err);
            err.text().then(data => {
                console.error(data)
            });
            dispatch({type: FETCH_EVENT_ERROR, payload: err});
        },
        (ex) => {
            console.error(ex);
            dispatch({type: FETCH_EVENT_FAILURE, payload: ex});
        },
        {
            headers: {"Authorization": `Bearer google-oauth2 ${access_token}`},
        })
};
