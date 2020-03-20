import {
    LOGOUT,
    LOGIN,
    FETCH_PROFILE,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAILURE,
    FETCH_PROFILE_ERROR
} from "../actions/types";

const initialState = {
    access_token: undefined,
    user_data: {},
    isSignedIn: false,
    profile_data: {
        isLoading: false,
        user_id: undefined,
        cars: [],
        score: undefined,
    },
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user_data: action.payload.user_data,
                access_token: action.payload.access_token,
                isSignedIn: true
            };
        case LOGOUT:
            return {
                ...state,
                access_token: undefined,
                user_data: {},
                isSignedIn: false,
                profile_data: {},
            };
        case FETCH_PROFILE:
            return {...state, profile_data: {...state.profile_data, isLoading: true}};
        case FETCH_PROFILE_SUCCESS:
            return {
                ...state,
                profile_data: {
                    ...state.profile_data,
                    isLoading: false,
                    score: action.payload.score,
                    user_id: action.payload.user,
                    cars: action.payload.car_set
                }
            };
        case FETCH_PROFILE_FAILURE:
        case FETCH_PROFILE_ERROR:
            return {...state, profile_data: {...state.profile_data, isLoading: false}};
        default:
            return state;
    }
}