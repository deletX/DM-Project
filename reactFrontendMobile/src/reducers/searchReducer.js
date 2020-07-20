import {SET_SEARCH} from "../actions/types";

const initialState = ""

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SEARCH:
            return action.search;
        default:
            return state;
    }
}

export default searchReducer;