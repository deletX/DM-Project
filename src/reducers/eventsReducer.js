import {
    FETCH_EVENTS,
    FETCH_EVENTS_SUCCESS,
    FETCH_EVENTS_FAILURE,
    FETCH_EVENTS_ERROR,
    POST_EVENT,
    POST_EVENT_SUCCESS,
    POST_EVENT_ERROR,
    POST_EVENT_FAILURE,
    POST_PARTICIPANT_SUCCESS,
    POST_PARTICIPANT,
    POST_PARTICIPANT_ERROR,
    POST_PARTICIPANT_FAILURE,
    FETCH_EVENT_SUCCESS,
    FETCH_EVENT_ERROR,
    FETCH_EVENT_FAILURE,
    FETCH_EVENT
} from "../actions/types";

const initialState = {
    events: [],
    isLoading: false,
    newParticipant: {
        isLoading: false,
    },
    newEvent: {
        isLoading: false,
        event: {},
    }

};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_EVENTS:
            return {...state, isLoading: true};
        case FETCH_EVENTS_SUCCESS:
            return {...state, events: action.payload, isLoading: false};
        case FETCH_EVENTS_ERROR:
        case FETCH_EVENTS_FAILURE:
            return {...state, isLoading: false};
        case POST_PARTICIPANT:
            return {...state, newParticipant: {...state.newParticipant, isLoading: true}};
        case POST_PARTICIPANT_SUCCESS:
        case POST_PARTICIPANT_ERROR:
        case POST_PARTICIPANT_FAILURE:
            return {...state, newParticipant: {...state.newParticipant, isLoading: false}};

        case POST_EVENT:
            return {...state, newEvent: {...state.newEvent, isLoading: true}};
        case POST_EVENT_SUCCESS:
        case POST_EVENT_ERROR:
        case POST_EVENT_FAILURE:
            return {...state, newEvent: {...state.newEvent, isLoading: false}};

        case FETCH_EVENT:
            return {...state, newEvent: {...state.newEvent, isLoading: true}};
        case FETCH_EVENT_SUCCESS:
            return {...state, newEvent: {...state.newEvent, isLoading: false, event: action.payload}};
        case FETCH_EVENT_ERROR:
        case FETCH_EVENT_FAILURE:
            return {...state, newEvent: {...state.newEvent, isLoading: false}};

        default:
            return state;
    }
}