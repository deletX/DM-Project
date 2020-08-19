import {updateObject} from "../utils/utils";
import {
    CAR_CREATE, CAR_DELETE, CAR_UPDATE,
    CLEAR_PROFILE_DATA,
    GET_PROFILE_SUCCESS,
    PROFILE_OP_START,
    PROFILE_OP_ERROR,
} from "../actions/types";

/**
 * Profile initial state
 *
 * @type {{score: number, givenFeedback: [], carSet: [], averageVote: number, id: string, loading: boolean, error: boolean, user: {}, picture: string, receivedFeedback: []}}
 */
const initialState = {
    id: "",
    picture: "",
    score: 0,
    carSet: [],
    averageVote: 0,
    receivedFeedback: [],
    givenFeedback: [],
    user: {},
    loading: false,
    error: false,
};

/**
 * Profile operation start handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const profileStart = (state, action) => {
    return updateObject(state, {loading: true})
};

/**
 * Profile retrieval successful handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const getProfileSuccess = (state, action) => {
    let {id, picture, score, carSet, averageVote, receivedFeedback, givenFeedback, user} = action;
    return updateObject(state, {
        loading: false,
        id,
        picture,
        score,
        carSet,
        averageVote,
        receivedFeedback,
        givenFeedback,
        user
    })
};


/**
 * Profile operation error handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const profileError = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: true,
    })
};

/**
 * Clear profile handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{score: number, givenFeedback: *[], carSet: *[], averageVote: number, id: string, loading: boolean, error: boolean, user: {}, picture: string, receivedFeedback: *[]}}
 */
const clearProfileData = (state, action) => {
    return initialState;
};

/**
 * Create car operation handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const carCreate = (state, action) => {
    let {id, name, totSeats, fuel, consumption} = action;

    const carSet = state.carSet;
    carSet.push({id: id, name: name, tot_avail_seats: totSeats, fuel: fuel, consumption: consumption});

    return {...state, carSet: carSet, loading: false};
};

/**
 * Car edit operation handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const carUpdate = (state, action) => {
    let {id, name, totSeats, fuel, consumption} = action;
    let index = state.carSet.findIndex((car) => (car.id === id));
    let carSet = state.carSet;

    carSet[index].name = name;
    carSet[index].tot_avail_seats = totSeats;
    carSet[index].fuel = fuel;
    carSet[index].consumption = consumption;
    return {...state, carSet: carSet, loading: false};
};

/**
 * Car delete operation handler
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{}}
 */
const carDelete = (state, action) => {
    let carSet = state.carSet.filter((car) => (car.id !== action.id));
    return updateObject(state, {
        carSet: carSet,
        loading: false,
    })
};
/**
 * Profile Reducer
 *
 * @param {{}} state
 * @param {{}} action
 *
 * @returns {{carSet: *, loading: boolean}|{score: number, givenFeedback: *[], carSet: *[], averageVote: number, id: string, loading: boolean, error: boolean, user: {}, picture: string, receivedFeedback: *[]}|*}
 */
const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROFILE_OP_START:
            return profileStart(state, action);
        case GET_PROFILE_SUCCESS:
            return getProfileSuccess(state, action);

        case PROFILE_OP_ERROR:
            return profileError(state, action);

        case CLEAR_PROFILE_DATA:
            return clearProfileData(state, action);
        case CAR_CREATE:
            return carCreate(state, action);
        case CAR_UPDATE:
            return carUpdate(state, action);
        case CAR_DELETE:
            return carDelete(state, action);
        default:
            return state;


    }
};

export default profileReducer;