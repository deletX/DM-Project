import {SET_SEARCH} from "./types";

export const setSearch = (search) => dispatch => (
    dispatch({
        type: SET_SEARCH,
        search: search,
    })
)