import {SET_SEARCH} from "../actions/types";

/**
 * Search initial state
 * @type {string}
 */
const initialState = ""

/**
 * Search root reducer
 * @param {string} state
 * @param {{type:string,search:string}} action
 * @return {string}
 */
const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SEARCH:
            return action.search;
        default:
            return state;
    }
}

export default searchReducer;