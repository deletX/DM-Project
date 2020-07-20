import {updateObject} from "../../utils";
import {
    CAR_CREATE, CAR_DELETE, CAR_UPDATE,
    CLEAR_PROFILE_DATA,
    GET_PROFILE_SUCCESS,
    PROFILE_OP_ERROR,
    PROFILE_OP_START,
    PROFILE_PICTURE_UPDATE,
    USER_DATA_UPDATE
} from "../actions/types";

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

const profileStart = (state, action) => {
    return updateObject(state, {loading: true})
};

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

const profilePictureUpdate = (state, action) => {
    return updateObject(state, {
        loading: false,
        picture: action.picture
    })
};

const profileError = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: true,
    })
};

const userDataUpdate = (state, action) => {
    let {id, firstName, lastName, email} = action;
    let user = state.user;
    user.id = id;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    return updateObject(state, {
        loading: false,
        user: user
    })
};

const clearProfileData = (state, action) => {
    return initialState;
};

const carCreate = (state, action) => {
    let {id, name, totSeats, fuel, consumption} = action;
    console.log("create")
    console.log(action)

    const carSet = state.carSet;
    carSet.push({id: id, name: name, tot_avail_seats: totSeats, fuel: fuel, consumption: consumption});
    return {...state, carSet: carSet, loading: false};
};

const carUpdate = (state, action) => {
    let {id, name, totSeats, fuel, consumption} = action;
    let index = state.carSet.findIndex((car) => (car.id === id));
    let carSet = state.carSet;
    console.log("edit")
    console.log(action)
    carSet[index].name = name;
    carSet[index].tot_avail_seats = totSeats;
    carSet[index].fuel = fuel;
    carSet[index].consumption = consumption;
    return {...state, carSet: carSet, loading: false};
};

const carDelete = (state, action) => {
    let carSet = state.carSet.filter((car) => (car.id !== action.id));
    return updateObject(state, {
        carSet: carSet,
        loading: false,
    })
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROFILE_OP_START:
            return profileStart(state, action);
        case GET_PROFILE_SUCCESS:
            return getProfileSuccess(state, action);
        case PROFILE_PICTURE_UPDATE:
            return profilePictureUpdate(state, action);
        case PROFILE_OP_ERROR:
            return profileError(state, action);
        case USER_DATA_UPDATE:
            return userDataUpdate(state, action);
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