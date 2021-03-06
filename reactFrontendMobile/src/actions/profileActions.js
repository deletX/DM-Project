import {
    CAR_CREATE,
    CAR_DELETE,
    CAR_UPDATE,
    CLEAR_PROFILE_DATA,
    GET_PROFILE_SUCCESS,
    PROFILE_OP_ERROR,
    PROFILE_OP_START
} from "./types";
import {handleError, handleSuccess} from "../utils/utils";
import AsyncStorage from '@react-native-community/async-storage'
import {deleteDeleteCar, getFetchProfile, postCreateCar, putUpdateCar} from "../utils/api";

/**
 * Profile operation start action object
 *
 * @returns {{type: string}}
 */
const start = () => (
    {
        type: PROFILE_OP_START
    }
);

/**
 * Profile retrieval success action object
 *
 * @param {number} id
 * @param {{email:string,first_name:string,id:number,last_name:string, username:string}}user
 * @param {string} picture
 * @param {number} score
 * @param {[{consumption:number, fuel:number, id:number, name:string,tot_avail_seats:number}]} carSet
 * @param {number} averageVote
 * @param {[{comment:string, event:{},giver:{},id:number, receiver:{},vote:number}]} receivedFeedback
 * @param {[{}]} givenFeedback
 *
 * @returns {{score: *, givenFeedback: *, carSet: *, averageVote: *, id: *, type: string, user: *, picture: *, receivedFeedback: *}}
 */
const getSuccess = (id,
                    user,
                    picture,
                    score,
                    carSet,
                    averageVote,
                    receivedFeedback,
                    givenFeedback) => (
    {
        type: GET_PROFILE_SUCCESS,
        id,
        picture,
        score,
        carSet,
        averageVote,
        receivedFeedback,
        givenFeedback,
        user
    }
);

/**
 * Profile operation fail action object
 *
 * @returns {{type: string}}
 */
const fail = () => (
    {
        type: PROFILE_OP_ERROR,
    }
);

/**
 * Car creation action object
 *
 * @param {number} id
 * @param {string} name
 * @param {number} totSeats
 * @param {number} fuel
 * @param {number} consumption
 *
 * @returns {{fuel: number, name: string, totSeats: number, consumption: number, id: number, type: string}}
 */
const createCarSuccess = (id, name, totSeats, fuel, consumption) => (
    {
        type: CAR_CREATE,
        id: id,
        name: name,
        totSeats: totSeats,
        fuel: fuel,
        consumption: consumption,
    }
);

/**
 * Car edit action object
 *
 * @param {number} id
 * @param {string} name
 * @param {number} totSeats
 * @param {number} fuel
 * @param {number} consumption
 *
 * @returns {{fuel: number, name: string, totSeats: number, consumption: number, id: number, type: string}}
 */
const changeCarSuccess = (id, name, totSeats, fuel, consumption) => (
    {
        type: CAR_UPDATE,
        id: id,
        name: name,
        totSeats: totSeats,
        fuel: fuel,
        consumption: consumption,
    }
);

/**
 * Car delete action object
 *
 * @param {number} id
 *
 * @returns {{id: number, type: string}}
 */
const deleteCarSuccess = (id) => (
    {
        type: CAR_DELETE,
        id,
    }
);

/**
 * Clear profile data from app (**does NOT erase the profile from the system**)
 *
 * @returns {function(*): *}
 */
export const clearProfileData = () => {
    return async (dispatch) => (
        dispatch(
            {
                type: CLEAR_PROFILE_DATA
            })
    );
}

/**
 * Profile retrieval action
 *
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export const fetchProfile = () => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = await AsyncStorage.getItem("access_token");
        return getFetchProfile(access_token,
            (res) => {
                let {id, user, picture, score, car_set, average_vote, received_feedback, given_feedback} = res.data;

                AsyncStorage.setItem("profile_id", id.toString());

                dispatch(getSuccess(id, user, picture, score, car_set, average_vote, received_feedback, given_feedback));
            },
            (err) => {
                dispatch(fail());
                handleError("Something went wrong while retrieving your profile [008]", err)
                return err;
            })
    }
};

/**
 * Create car action
 *
 * @param {string} name
 * @param {number} totSeats
 * @param {number} fuel
 * @param {number} consumption
 *
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export const createCar = (name, totSeats, fuel, consumption) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = await AsyncStorage.getItem("access_token");
        let profileId = parseInt(await AsyncStorage.getItem("profile_id"));

        return postCreateCar(profileId, name, totSeats, fuel, consumption, access_token,
            (res) => {
                let {id, name, tot_avail_seats, fuel, consumption} = res.data;
                dispatch(createCarSuccess(id, name, tot_avail_seats, fuel, consumption))
                handleSuccess("Successfully added your car")
            },
            (err) => {
                dispatch(fail());
                handleError("Something went wrong while creating the car [009]", err)
                return err;
            })
    };
}

/**
 * Car edit action
 *
 * @param {number} id
 * @param {string} name
 * @param {number} totSeats
 * @param {number} fuel
 * @param {number} consumption
 *
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export const updateCar = (id, name, totSeats, fuel, consumption) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = await AsyncStorage.getItem("access_token");
        let profileId = parseInt(await AsyncStorage.getItem("profile_id"));
        return putUpdateCar(profileId, id, name, totSeats, fuel, consumption, access_token,
            (res) => {
                let {id, name, tot_avail_seats, fuel, consumption} = res.data;
                dispatch(changeCarSuccess(id, name, tot_avail_seats, fuel, consumption))
                handleSuccess("Successfully edited your car")
            },
            (err) => {
                dispatch(fail());
                handleError("Something went wrong while editing the car [010]", err)
                return err;
            })
    };
}

/**
 * Car delete action (**no coming back**)
 *
 * @param {number} id
 *
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export const deleteCar = (id) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = await AsyncStorage.getItem("access_token");
        let profileId = parseInt(await AsyncStorage.getItem("profile_id"));
        return deleteDeleteCar(profileId, id, access_token,
            (res) => {
                dispatch(deleteCarSuccess(id));
                handleSuccess("Successfully deleted your car")
            },
            (err) => {
                dispatch(fail());
                handleError("Something went wrong while deleting the car [011]", err)
                return err;
            })
    };
}
