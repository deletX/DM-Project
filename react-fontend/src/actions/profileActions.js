import {
    CAR_CREATE, CAR_DELETE, CAR_UPDATE,
    CLEAR_PROFILE_DATA,
    GET_PROFILE_SUCCESS,
    PROFILE_OP_ERROR,
    PROFILE_OP_START,
    PROFILE_PICTURE_UPDATE,
    USER_DATA_UPDATE
} from "./types";
import {handleError, handleSuccess} from "../utils/utils";
import {addAlert, alertError} from "./alertActions";
import {authLogout} from "./authActions";
import {
    deleteProfile,
    getFetchProfile,
    postCreateCar,
    putChangeProfilePicture,
    putChangeUserData,
    putUpdateCar,
    deleteDeleteCar
} from "../utils/api";


const start = () => (
    {
        type: PROFILE_OP_START
    }
);

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

const successPictureUpdate = (picture) => (
    {
        type: PROFILE_PICTURE_UPDATE,
        picture,
    }
);

const fail = () => (
    {
        type: PROFILE_OP_ERROR,
    }
);

const changeUserDataSuccess = (id, firstName, lastName, email) => (
    {
        type: USER_DATA_UPDATE,
        id,
        firstName,
        lastName,
        email
    }
);

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

const deleteCarSuccess = (id) => (
    {
        type: CAR_DELETE,
        id,
    }
);

export const clearProfileData = () => {
    return async (dispatch) => (
        dispatch(
            {
                type: CLEAR_PROFILE_DATA
            })
    );
}


export const fetchProfile = () => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        return getFetchProfile(access_token,
            (res) => {
                let {id, user, picture, score, car_set, average_vote, received_feedback, given_feedback} = res.data;
                localStorage.setItem("profile_id", id);
                // dispatch(removeAllAlerts());
                dispatch(getSuccess(id, user, picture, score, car_set, average_vote, received_feedback, given_feedback));
            },
            (err) => {
                dispatch(fail());
                dispatch(alertError(err));
                return err;
            })
    }
};

export const changePicture = (picture, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let formData = new FormData();
        formData.append("picture", picture, picture.name);
        return putChangeProfilePicture(formData, access_token,
            (res) => {
                console.log("picture changed")
                dispatch(successPictureUpdate(res.data.picture));
                //dispatch(addAlert("Picture changed successfully!", "success"));
                handleSuccess(enqueueSnackbar, "Profile picture changed successfully!")
            },
            (err) => {
                console.log("error picture changed")
                dispatch(alertError(err));
                dispatch(fail());
                handleError(enqueueSnackbar, "Error while changing profile picture")
                return err;
            })
    };
}

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
                console.log("Changed user data")
                let {id, firstName, lastName, email} = res.data;
                handleSuccess(enqueueSnackbar, "Successfully changed user data")
                dispatch(changeUserDataSuccess(id, firstName, lastName, email));
            },
            (err) => {
                dispatch(alertError(err));
                dispatch(fail());
                console.log("error changed user data")
                handleError(enqueueSnackbar, "Error while changin user data")
                return err;
            })
    };
}

export const deleteUser = () => { //not used
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        return deleteProfile(access_token,
            (res) => {
                addAlert("You have been deleted from the system!", "success");
                dispatch(authLogout());
            },
            (err) => {
                dispatch(alertError(err));
                dispatch(fail());
                return err;
            })
    };
}

export const createCar = (name, totSeats, fuel, consumption, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let profileId = localStorage.getItem("profile_id");
        console.log(name, totSeats, consumption)
        return postCreateCar(profileId, name, totSeats, fuel, consumption, access_token,
            (res) => {
                let {id, name, tot_avail_seats, fuel, consumption} = res.data;
                dispatch(createCarSuccess(id, name, tot_avail_seats, fuel, consumption))
                //handleSuccess(enqueueSnackbar, "Successufully added car")
                console.log("Car added")
            },
            (err) => {
                dispatch(alertError(err));
                dispatch(fail());
                console.error("Could not add car")
                //handleError(enqueueSnackbar, "Error while adding car")
                return err;
            })
        //
        // return axios
        //     .post(
        //         carsListURL(profileId),
        //         {
        //             name: name,
        //             tot_avail_seats: totSeats,
        //             fuel: fuel,
        //             consumption: consumption,
        //         },
        //         headers('application/json', access_token)
        //     )
        //     .then(res => {
        //         let {id, name, tot_avail_seats, fuel, consumption} = res.data;
        //         dispatch(createCarSuccess(id, name, tot_avail_seats, fuel, consumption))
        //         console.log("Car added")
        //     })
        //     .catch(error => {
        //         dispatch(alertError(error));
        //         dispatch(fail());
        //         console.error("Could not add car")
        //         return error;
        //     })
    };
}

export const updateCar = (id, name, totSeats, fuel, consumption) => {
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
                dispatch(alertError(err));
                dispatch(fail());
                return err;
            })
    };
}

export const deleteCar = (id) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let profileId = localStorage.getItem("profile_id");
        return deleteDeleteCar(profileId, id, access_token,
            (res) => {
                dispatch(deleteCarSuccess(id));
            },
            (err) => {
                dispatch(alertError(err));
                dispatch(fail());
                return err;
            })
    };
}
