import axios from "axios";
import {
    CAR_CREATE, CAR_DELETE, CAR_UPDATE,
    CLEAR_PROFILE_DATA,
    GET_PROFILE_SUCCESS,
    PROFILE_OP_ERROR,
    PROFILE_OP_START,
    PROFILE_PICTURE_UPDATE,
    USER_DATA_UPDATE
} from "./types";
import {carsDetailURL, carsListURL, currentProfileURL, signupURL} from "../constants/apiurls";
import {headers} from "../utils";
import {addAlert, alertError, removeAllAlerts} from "./alertActions";
import {authLogout} from "./authActions";


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
        return axios
            .get(
                currentProfileURL(),
                headers('application/json', access_token)
            )
            .then(res => {
                let {id, user, picture, score, car_set, average_vote, received_feedback, given_feedback} = res.data;
                localStorage.setItem("profile_id", id);
                // dispatch(removeAllAlerts());
                dispatch(getSuccess(id, user, picture, score, car_set, average_vote, received_feedback, given_feedback));
            })
            .catch(error => {
                dispatch(fail());
                dispatch(alertError(error));
                return error;
            })
    }
};


export const changePicture = (picture) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let formData = new FormData();
        formData.append("picture", picture, picture.name);
        return axios
            .put(
                currentProfileURL(),
                formData,
                headers('multipart/form-data', access_token)
            )
            .then(res => {
                dispatch(successPictureUpdate(res.data.picture));
                dispatch(addAlert("Immagine modificata con successo!", "success"));
            })
            .catch(error => {
                dispatch(alertError(error));
                dispatch(fail());
                return error;
            })
    };
}

export const changeUserData = (first_name, last_name, email, password = null) => {
    return async (dispatch) => {
        dispatch(start());
        console.log("tette")
        let access_token = localStorage.getItem("access_token");
        let data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
        };
        if (password != null) {
            data.password = password;
        }
        return axios
            .put(
                signupURL(),
                data,
                headers('application/json', access_token)
            )
            .then(res => {
                let {id, firstName, lastName, email} = res.data;
                dispatch(changeUserDataSuccess(id, firstName, lastName, email));
            })
            .catch(error => {
                dispatch(alertError(error));
                dispatch(fail());
                return error;
            });
    };
}


export const deleteUser = () => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");

        return axios
            .delete(
                signupURL(),
                headers('application/json', access_token)
            )
            .then(res => {
                addAlert("You have been deleted from the system!", "success");
                dispatch(authLogout());
            })
            .catch(error => {
                dispatch(alertError(error));
                dispatch(fail());
                return error;
            })
    };
}


export const createCar = (name, totSeats, fuel, consumption) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let profileId = localStorage.getItem("profile_id");

        return axios
            .post(
                carsListURL(profileId),
                {
                    name: name,
                    tot_avail_seats: totSeats,
                    fuel: fuel,
                    consumption: consumption,
                },
                headers('application/json', access_token)
            )
            .then(res => {
                let {id, name, tot_avail_seats, fuel, consumption} = res.data;
                dispatch(createCarSuccess(id, name, tot_avail_seats, fuel, consumption))
            })
            .catch(error => {
                dispatch(alertError(error));
                dispatch(fail());
                return error;
            })
    };
}

export const updateCar = (id, name, totSeats, fuel, consumption) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let profileId = localStorage.getItem("profile_id");

        return axios
            .put(
                carsDetailURL(profileId, id),
                {
                    name: name,
                    tot_avail_seats: totSeats,
                    fuel: fuel,
                    consumption: consumption,
                },
                headers('application/json', access_token)
            )
            .then(res => {
                let {id, name, tot_avail_seats, fuel, consumption} = res.data;
                dispatch(changeCarSuccess(id, name, tot_avail_seats, fuel, consumption))
            })
            .catch(error => {
                dispatch(alertError(error));
                dispatch(fail());
                return error;
            })
    };
}


export const deleteCar = (id) => {
    return async (dispatch) => {
        dispatch(start());
        let access_token = localStorage.getItem("access_token");
        let profileId = localStorage.getItem("profile_id");
        return axios
            .delete(
                carsDetailURL(profileId, id),
                headers('application/json', access_token)
            )
            .then(res => {
                dispatch(deleteCarSuccess(id));
            })
            .catch(error => {
                dispatch(alertError(error));
                dispatch(fail());
                return error;
            })
    };
}
