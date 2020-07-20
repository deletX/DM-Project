import {SET_SEARCH} from "./types";

export const setSearch = (search) => {
    return async dispatch => (
        dispatch({
            type: SET_SEARCH,
            search: search,
        })
    )
}