import {SET_SEARCH} from "./types";

/**
 * Dispatches the search action
 *
 * @param {string} search
 *
 * @return {function(*): Promise<*>}
 */
export const setSearch = (search) => {
    return async dispatch => (
        dispatch({
            type: SET_SEARCH,
            search: search,
        })
    )
}