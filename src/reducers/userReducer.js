import {LOGOUT, LOGIN} from "../actions/types";

const initialState = {
    access_token: undefined,
    user_data: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return action.payload;
        case LOGOUT:
            return {
                access_token: undefined,
                user_data: {}
            };
        default:
            return state;
    }
}