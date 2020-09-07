import axios from "axios";
import {
    carsDetailURL,
    carsListURL,
    convertTokenURL,
    createFeedbackURL,
    currentProfileURL,
    eventDetailURL,
    eventJoinURL,
    eventListURL,
    eventRunURL,
    nominatimCoordinatesToAddressURL,
    notificationEditURL,
    notificationListURL,
    participationEditURL,
    profilesURL,
    tokenURL
} from "../constants/apiurls";
import {handleError, handleSuccess, headers, selectItem} from "./utils";
import {APP_CLIENTID, APP_SECRET} from "../constants/constants";
import * as qs from "qs";

/*
    DMPROJECT API
 */

/**
 * API call to start the computation (**only the owner can do so**)
 *
 * @param {number} eventId
 * @param {string} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const runEvent = (eventId, token, onSuccess, onError) => {
    axios
        .get(
            eventRunURL(eventId),
            headers('application/json', token),
        )
        .then(res => {
            onSuccess(res)
            handleSuccess("Computation started")
        })
        .catch(err => {
            onError(err)
            handleError("Something went wrong while launching the computation [016]", err)
        })
}

export const getEventDetail = async (eventId, token, onSuccess, onError) => {
    return axios
        .get(
            eventDetailURL(eventId),
            headers('application/json', token),
        )
        .then(res => {
            return onSuccess(res)
        })
        .catch(err => {
            onError(err)
            handleError("Something went wrong while retrieving event [003]", err)
        })
}

/**
 * API call to retrieve the list of events with the relative filters
 *
 * @param {boolean} joinable
 * @param {boolean} joined
 * @param {boolean} owned
 * @param {string} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const getListEvent = (joinable, joined, owned, token, onSuccess, onError) => {
    axios
        .get(
            eventListURL(joinable, joined, owned),
            headers('application/json', token))
        .then((res) => {
            onSuccess(res)
        })
        .catch((err) => {
            onError(err)
            handleError("Error while retrieving events list", err)
        });
}

/**
 * API call to join an event at {@link eventJoinURL}.
 *
 * @param {number} eventId
 * @param {string} token
 * @param {string} startingAddress
 * @param {string} startingPos
 * @param {number} carId
 * @param {function()} onSuccess
 *
 * @return {Promise<void>}
 */
export const postJoinedEvent = async (eventId, token, startingAddress, startingPos, carId, onSuccess, onError) => {
    axios
        .post(
            eventJoinURL(eventId),
            {
                starting_address: startingAddress,
                starting_pos: startingPos,
                car: carId
            },
            headers('application/json', token)
        )
        .then(res => {
                onSuccess(res)
                handleSuccess("Successfully joined the event!")
            }
        )
        .catch(err => {
                onError(err)
                handleError("Something went wrong while joining the event [013]", err)
            }
        )
}

/**
 * API call to leave an event, performing a delete at {@link participationEditURL}
 *
 * @param {number} eventID
 * @param {number} token
 * @param participationID
 * @param {function} onSuccess callback called after success
 *
 * @return {Promise<void>}
 */
export const deleteLeaveEvent = async (eventID, token, participationID, onSuccess) => {
    axios
        .delete(
            participationEditURL(eventID, participationID),
            headers('application/json', token)
        )
        .then(res => {
            onSuccess(res);
            handleSuccess("Successfully left event")
        })
        .catch(err => {
            handleError("Something went wrong while leaving [002]", err)
        })

}

/**
 * API call to delete an event (**only the owner can do so**)
 *
 * @param {number} eventId
 * @param {string} token
 * @param {function()} onSuccess
 */
export const deleteEvent = (eventId, token, onSuccess) => {
    axios
        .delete(
            eventDetailURL(eventId),
            headers('application/json', token)
        )
        .then(res => {
            onSuccess(res)
            handleSuccess("Deleted event successfully")
        })
        .catch(err => {
            handleError("Something went wrong while deleting your event [015]", err)
        })
}


/**
 * API call to create a feedback
 *
 * @param {number} eventId
 * @param {number} receiver
 * @param {string} comment
 * @param {number} vote
 * @param {string} token
 * @param {function()} onSuccess
 */
export const postCreateFeedback = (eventId, receiver, comment, vote, token, onSuccess) => {
    axios
        .post(
            createFeedbackURL(eventId, receiver),
            {
                receiver: receiver,
                event: eventId,
                comment: comment,
                vote: vote,
            },
            headers('application/json', token)
        )
        .then((res) => {
            onSuccess(res)
            handleSuccess("Successfully created feedback")
        })
        .catch((error) => {
            handleError("Something went wrong while posting your feedback [014]", error)
        })
}


/**
 * API call to retrieve another user's profile
 *
 * @param {number} id
 * @param {string} token
 * @param {function()} onSuccess
 *
 * @return {Promise<void>}
 */
export const getProfile = async (id, token, onSuccess) => {
    axios
        .get(
            profilesURL(id),
            headers('application/json', token))
        .then(res => {
            onSuccess(res);
        })
        .catch(err => {
            handleError("Something went wrong while retrieving the profile [008]", err)
        })
}

export const getFetchProfile = (token, onSuccess, onError) => {
    axios
        .get(
            currentProfileURL(),
            headers('application/json', token)
        )
        .then((res) => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        })
}

export const postCreateCar = (profileId, name, totSeats, fuel, consumption, token, onSuccess, onError) => {
    axios
        .post(
            carsListURL(profileId),
            {
                name: name,
                tot_avail_seats: totSeats,
                fuel: fuel,
                consumption: consumption,
            },
            headers('application/json', token)
        )
        .then((res) => {
            onSuccess(res);
        })
        .catch(err => {
            onError(err)
        });
}

export const putUpdateCar = (profileId, id, name, totSeats, fuel, consumption, token, onSuccess, onError) => {
    axios
        .put(
            carsDetailURL(profileId, id),
            {
                name: name,
                tot_avail_seats: totSeats,
                fuel: fuel,
                consumption: consumption,
            },
            headers('application/json', token)
        )
        .then((res) => {
            onSuccess(res);
        })
        .catch(err => {
            onError(err)
        });
}

export const deleteDeleteCar = (profileId, id, token, onSuccess, onError) => {
    axios
        .delete(
            carsDetailURL(profileId, id),
            headers('application/json', token)
        )
        .then((res) => {
            onSuccess(res);
        })
        .catch(err => {
            onError(err)
        });
}


export const postRefreshAuth = (refreshToken, onSuccess, onError) => {
    axios
        .post(
            tokenURL(),
            qs.stringify({
                client_id: APP_CLIENTID,
                client_secret: APP_SECRET,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
            headers('application/x-www-form-urlencoded')
        )
        .then(res => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        });
}

export const postGoogleOAuthLogin = (googleToken, onSuccess, onError) => {
    axios
        .post(
            convertTokenURL(),
            qs.stringify({
                client_id: APP_CLIENTID,
                client_secret: APP_SECRET,
                grant_type: 'convert_token',
                backend: 'google-oauth2',
                token: googleToken
            }),
            headers("application/x-www-form-urlencoded")
        )
        .then(res => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        });
}

export const postAuthLogin = (username, password, onSuccess, onError) => {
    axios
        .post(
            tokenURL(),
            qs.stringify({
                client_id: APP_CLIENTID,
                client_secret: APP_SECRET,
                grant_type: 'password',
                username: username,
                password: password,
            }),
            headers("application/x-www-form-urlencoded")
        )
        .then(res => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        });
}


/*
    NOMINATIM API
 */

/**
 * Nomatim API call to get address data from a lat, lon couple.
 *
 * @param {number} latitude
 * @param {number} longitude
 *
 * @return {Promise<[string, string]>}
 */
export const getNominatimInfo = async (latitude, longitude) => {

    return axios
        .get(
            nominatimCoordinatesToAddressURL(latitude, longitude)
        )
        .then((res) => {
                return selectItem(res.data);
            }
        )
        .catch((error) => {
            handleError("Something went wrong while getting address of your position [012]", error)
        })
}


export const getNotifications = (token, onSuccess, onError) => {
    axios
        .get(
            notificationListURL(),
            headers('application/json', token)
        )
        .then((res) => {
            onSuccess(res);
        })
        .catch(err => {
            onError(err)
        });
}

export const putReadNotifications = (token, notificationId, read, onSuccess, onError) => {
    axios
        .put(
            notificationEditURL(notificationId),
            {
                read: read
            },
            headers('application/json', token)
        ).then((res) => {
        onSuccess(res);
    })
        .catch(err => {
            onError(err)
        });
}