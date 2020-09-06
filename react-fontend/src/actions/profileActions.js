import {
    CAR_CREATE,
    CAR_DELETE,
    CAR_UPDATE,
    CLEAR_PROFILE_DATA,
    GET_PROFILE_SUCCESS,
    PROFILE_OP_ERROR,
    PROFILE_OP_START,
    PROFILE_PICTURE_UPDATE,
    USER_DATA_UPDATE
} from "./types";
import {handleError, handleSuccess} from "../utils/utils";
import {authLogout} from "./authActions";
import {
    deleteDeleteCar,
    deleteProfile,
    getFetchProfile,
    postCreateCar,
    putChangeProfilePicture,
    putChangeUserData,
    putUpdateCar
} from "../utils/api";

/**
 * Profile operation start action
 *
 * @return {{type: string}}
 */
const start = () => (
    {
        type: PROFILE_OP_START
    }
);

/**
 * Profile retrieval success action
 *
 * @param {number} id
 * @param {{}} user
 * @param {string} picture
 * @param {number} score
 * @param {[]} carSet
 * @param {number} averageVote
 * @param {[]}receivedFeedback
 * @param {[]}givenFeedback
 *
 * @return {{score: number, givenFeedback: [], carSet: [], averageVote: number, id: number, type: string, user: {}, picture: string, receivedFeedback: []}}
 */
const getSuccess = (id, user, picture, score, carSet, averageVote, receivedFeedback, givenFeedback) => (
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
 * Picture update action
 *
 * @param {string} picture
 *
 * @return {{type: string, picture: string}}
 */
const successPictureUpdate = (picture) => (
    {
        type: PROFILE_PICTURE_UPDATE,
        picture,
    }
);

/**
 * Profile operation fail action
 *
 * @return {{type: string}}
 */
const fail = () => (
    {
        type: PROFILE_OP_ERROR,
    }
);

/**
 * Change user data action
 *
 * @param {number} id
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @return {{firstName: string, lastName: string, id: number, type: string, email: string}}
 */
const changeUserDataSuccess = (id, firstName, lastName, email) => (
    {
        type: USER_DATA_UPDATE,
        id,
        firstName,
        lastName,
        email
    }
);

/**
 * Car creation action
 *
 * @param {number} id
 * @param {string} name
 * @param {number} totSeats
 * @param {number} fuel
 * @param {number} consumption
 *
 * @return {{fuel: number, name: string, totSeats: number, consumption: number, id: number, type: string}}
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
 * Car update action
 *
 * @param {number} id
 * @param {string} name
 * @param {number} totSeats
 * @param {number} fuel
 * @param {number} consumption
 *
 * @return {{fuel: number, name: string, totSeats: number, consumption: number, id: number, type: string}}
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
 * Car delete action
 *
 * @param {number} id
 *
 * @return {{id: number, type: string}}
 */
const deleteCarSuccess = (id) => (
    {
        type: CAR_DELETE,
        id,
    }
);

/**
 * Dispatches the clear data action
 *
 * @return {function(*): Promise<*>}
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
 * Execute the API to retrieve the profile of the user. It dispatches either the retrieve profile action or
 * the fail one
 *
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const fetchProfile = (enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        return getFetchProfile(access_token,
            (res) => {
                let {id, user, picture, score, car_set, average_vote, received_feedback, given_feedback} = res.data;
                localStorage.setItem("profile_id", id);
                dispatch(getSuccess(id, user, picture, score, car_set, average_vote, received_feedback, given_feedback));
            },
            (err) => {
                dispatch(fail());
                handleError(enqueueSnackbar, "Something went wrong while retrieving the profile [025]", err)
                return err;
            })
    }
};

/**
 * Execute the API to change profile picture. Dispatches either the change picture action or the fail action
 *
 * @param {Blob} picture
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const changePicture = (picture, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let formData = new FormData();
        formData.append("picture", picture, picture.name);
        return putChangeProfilePicture(formData, access_token,
            (res) => {
                dispatch(successPictureUpdate(res.data.picture));
                handleSuccess(enqueueSnackbar, "Profile picture updated successfully!")
            },
            (err) => {
                dispatch(fail());
                handleError(enqueueSnackbar, "Something went wrong while changing profile picture [026]", err)
                return err;
            })
    };
}

/**
 * Execute the API to change the user data. It dispatches either the change user data action or the fail one.
 *
 * @param {string} first_name
 * @param {string} last_name
 * @param {string} email
 * @param {string} password
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const changeUserData = (first_name, last_name, email, password = null, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
        };
        if (password != null) {
            data.password = password;
        }
        return putChangeUserData(data, access_token,
            (res) => {
                let {id, firstName, lastName, email} = res.data;
                handleSuccess(enqueueSnackbar, "Successfully changed your info")
                dispatch(changeUserDataSuccess(id, firstName, lastName, email));
            },
            (err) => {
                dispatch(fail());
                handleError(enqueueSnackbar, "Something went wrong while changing your data [027]", err)
                return err;
            })
    };
}

/**
 * Execute the API to remove the user from the system.
 *
 * **It is not used in the application yet**
 *
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const deleteUser = (enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        return deleteProfile(access_token,
            () => {
                handleSuccess(enqueueSnackbar, "You have been successfully removed from the system!")
                dispatch(authLogout());
            },
            (err) => {
                dispatch(fail());
                handleError(enqueueSnackbar, "Something went wrong while deleting you [028]", err)
                return err;
            })
    };
}

/**
 * Execute the API to create a Car and dispatches either the create car action or the fail one
 *
 * @param {string} name
 * @param {number} totSeats
 * @param {number} fuel
 * @param {number} consumption
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const createCar = (name, totSeats, fuel, consumption, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let profileId = localStorage.getItem("profile_id");
        console.log("my token ", access_token, " profileId ", profileId)
        return postCreateCar(profileId, name, totSeats, fuel, consumption, access_token,
            (res) => {
                let {id, name, tot_avail_seats, fuel, consumption} = res.data;
                dispatch(createCarSuccess(id, name, tot_avail_seats, fuel, consumption))
                handleSuccess(enqueueSnackbar, "Successfully added a car")
            },
            (err) => {
                dispatch(fail());
                handleError(enqueueSnackbar, "Something went wrong while adding a car [029]", err)
                return err;
            })

    };
}

/**
 * Execute the API to update a Car. Dispatches the update car action or the fail one
 *
 * @param {number} id
 * @param {string} name
 * @param {number} totSeats
 * @param {number} fuel
 * @param {number} consumption
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const updateCar = (id, name, totSeats, fuel, consumption, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let profileId = localStorage.getItem("profile_id");
        return putUpdateCar(profileId, id, name, totSeats, fuel, consumption, access_token,
            (res) => {
                let {id, name, tot_avail_seats, fuel, consumption} = res.data;
                dispatch(changeCarSuccess(id, name, tot_avail_seats, fuel, consumption))
            },
            (err) => {
                handleError(enqueueSnackbar, "Something went wrong while updating your car [030]", err)
                dispatch(fail());
                return err;
            })
    };
}

/**
 * Execute the API to delete a Car. Dispatches the delete car or fail action
 *
 * @param {number} id
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const deleteCar = (id, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let profileId = localStorage.getItem("profile_id");
        return deleteDeleteCar(profileId, id, access_token,
            () => {
                dispatch(deleteCarSuccess(id));
            },
            (err) => {
                dispatch(fail());
                handleError(enqueueSnackbar, "Something went wrong while deleting your car [031]", err)
                return err;
            })
    };
}
