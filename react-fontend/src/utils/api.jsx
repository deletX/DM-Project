import axios from "axios";
import {
    carsDetailURL,
    carsListURL,
    convertTokenURL,
    createFeedbackURL,
    currentProfileURL,
    editFeedbackURL,
    eventCreateURL,
    eventDetailURL,
    eventJoinURL,
    eventListURL,
    eventRunURL,
    nominatimCoordinatesToAddressURL,
    nominatimSearchAddressURL,
    notificationEditURL,
    notificationListURL,
    participationEditURL,
    profilesURL,
    signupURL,
    tokenURL
} from "../constants/apiurls";
import {headers} from "./utils";
import {APP_CLIENTID, APP_SECRET} from "../constants/constants";
import * as qs from "qs";

/**
 * Execute event API call
 *
 * @param {number} eventId
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const runEvent = (eventId, token, onSuccess, onError) => (
    axios
        .get(
            eventRunURL(eventId),
            headers('application/json', token),
        )
        .then(res => {
            onSuccess(res);
        })
        .catch(err => {
            onError(err);
        })
)

/**
 * Event details API call
 *
 * @param {number} eventId
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const getEventAxios = (eventId, token, onSuccess, onError) => (
    axios
        .get(
            eventDetailURL(eventId),
            headers('application/json', token)
        )
        .then(res => {
            onSuccess(res);
        })
        .catch(err => {
            onError(err);
        })
)

/**
 * Event list API call with filters
 *
 * @param {number} joinable joinable filter
 * @param {number} joined joined filter
 * @param {number} owned owned filter
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const getEventsList = (joinable, joined, owned, token, onSuccess, onError) => (
    axios
        .get(
            eventListURL(joinable, joined, owned),
            headers('application/json', token)
        )
        .then(res => {
            onSuccess(res);
        })
        .catch(err => {
            onError(err);
        })
)

/**
 * Create event API call
 *
 * @param {number} token
 * @param {FormData|{}} data
 * @param {Blob} image
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const postCreateEvent = (token, data, image, onSuccess, onError) => (
    axios
        .post(
            eventCreateURL(),
            data,
            image !== null ?
                headers('multipart/form-data', token) :
                headers('application/json', token)
        )
        .then((res) => {
            onSuccess(res)
        })
        .catch((err) => {
            onError(err)
        })
)

/**
 * Join event API call
 * @param {number} eventId
 * @param {string} starting_address
 * @param {string} starting_pos
 * @param {number} car
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const postJoinEvent = (eventId, starting_address, starting_pos, car, token, onSuccess, onError) => (
    axios
        .post(
            eventJoinURL(eventId),
            {
                starting_address: starting_address,
                starting_pos: starting_pos,
                car: car === -1 ? null : car
            },
            headers('application/json', token)
        )
        .then(res => {
                onSuccess(res)
            }
        )
        .catch(err => {
                onError(err)
            }
        )
)

/**
 * Update event API call
 *
 * @param {number} eventId
 * @param {FormData|{}}data
 * @param {number} token
 * @param {Blob} image
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const updateEvent = (eventId, data, token, image, onSuccess, onError) => (
    axios
        .put(
            eventDetailURL(eventId),
            data,
            image !== null ?
                headers('multipart/form-data', token) :
                headers('application/json', token)
        )
        .then(res => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        })
)

/**
 * Delete participation API call
 *
 * @param {number} eventId
 * @param {number} partecipationId
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const leaveEvent = (eventId, partecipationId, token, onSuccess, onError) => (
    axios
        .delete(
            participationEditURL(eventId, partecipationId),
            headers('application/json', token)
        )
        .then(res => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        })
)

/**
 * Delete event API call
 *
 * @param {number} eventId
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const deleteEvent = (eventId, token, onSuccess, onError) => (
    axios
        .delete(
            eventDetailURL(eventId),
            headers('application/json', token)
        )
        .then(res => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        })
)

/**
 * Leave a feedback API call
 *
 * @param {number} eventId
 * @param {number} receiver
 * @param {string} comment
 * @param {number} vote
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const postCreateFeedback = (eventId, receiver, comment, vote, token, onSuccess, onError) => (
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
        })
        .catch((err) => {
            onError(err)
        })
)

/**
 * Amend feedback API call
 *
 * @param {number} eventId
 * @param {number} receiverId
 * @param {number} feedbackId
 * @param {string} comment
 * @param {number} vote
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const putEditFeedback = (eventId, receiverId, feedbackId, comment, vote, token, onSuccess, onError) => (
    axios
        .put(
            editFeedbackURL(eventId, receiverId, feedbackId),
            {
                receiver: receiverId,
                event: eventId,
                comment: comment,
                vote: vote,
            },
            headers('application/json', token)
        )
        .then((res) => {
            onSuccess(res)
        })
        .catch((err) => {
            onError(err)
        })
)

/**
 * Retrieve profile API call
 *
 * @param {number} profileId
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const getProfileData = (profileId, token, onSuccess, onError) => (
    axios
        .get(profilesURL(profileId),
            headers('application/json', token))
        .then((res) => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        })
)

/**
 * Retrieve user profile API call
 *
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const getFetchProfile = (token, onSuccess, onError) => (
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
)

/**
 * Delete user API call
 *
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const deleteProfile = (token, onSuccess, onError) => (
    axios
        .delete(
            signupURL(),
            headers('application/json', token)
        )
        .then((res) => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        })
)

/**
 * Change profile picture API call
 *
 * @param {FormData} formData
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const putChangeProfilePicture = (formData, token, onSuccess, onError) => (
    axios
        .put(
            currentProfileURL(),
            formData,
            headers('multipart/form-data', token)
        )
        .then((res) => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        })
)

/**
 * Change user data API call
 * @param {{}} data
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const putChangeUserData = (data, token, onSuccess, onError) => (
    axios
        .put(
            signupURL(),
            data,
            headers('application/json', token)
        )
        .then((res) => {
            onSuccess(res);
        })
        .catch(err => {
            onError(err)
        })
)

/**
 * Create car API call
 *
 * @param {number} profileId
 * @param {string} name
 * @param {number} totSeats
 * @param {number} fuel
 * @param {number} consumption
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const postCreateCar = (profileId, name, totSeats, fuel, consumption, token, onSuccess, onError) => (
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
        })
)

/**
 * Amend car API call
 *
 * @param {number} profileId
 * @param {number} id
 * @param {string} name
 * @param {number} totSeats
 * @param {number} fuel
 * @param {number} consumption
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const putUpdateCar = (profileId, id, name, totSeats, fuel, consumption, token, onSuccess, onError) => (
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
        })
)

/**
 * Remove a car API call
 *
 * @param {number} profileId
 * @param {number} id
 * @param {number} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const deleteDeleteCar = (profileId, id, token, onSuccess, onError) => (
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
        })
)

/**
 * Refresh auth with refresh token API call
 *
 * @param {string} refreshToken
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const postRefreshAuth = (refreshToken, onSuccess, onError) => (
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
        })
)

/**
 * Login with Google API call
 *
 * @param {string} googleToken
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const postGoogleOAuthLogin = (googleToken, onSuccess, onError) => (
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
        })
)

/**
 * Login with usr:psw API call
 *
 * @param {string} username
 * @param {string} password
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const postAuthLogin = (username, password, onSuccess, onError) => (
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
            return onSuccess(res)
        })
        .catch(err => {
            onError(err)
        })
)

/**
 * Signup API call
 *
 * @param {string} username
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} password
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const postAuthSignup = (username, firstName, lastName, email, password, onSuccess, onError) => (
    axios
        .post(
            signupURL(),
            {
                username: username,
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            },
            headers('application/json')
        )
        .then(res => {
            return onSuccess(res)
        })
        .catch(err => {
            onError(err)
        })
)

/**
 * Retrieve notifications API call
 *
 * @param {string} token
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const getNotifications = (token, onSuccess, onError) => (
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
        })
)

/**
 * Read a notification API call
 *
 * @param {string} token
 * @param {number} notificationId
 * @param {boolean} read
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const putReadNotifications = (token, notificationId, read, onSuccess, onError) => (
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
        })
)

/**
 * Get nominatim address information for a coordinate couple.
 *
 * See {@link https://nominatim.org/release-docs/develop/api/Reverse/}
 *
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const getNominatimInfo = (latitude, longitude, onSuccess, onError) => {
    axios.get(nominatimCoordinatesToAddressURL(latitude, longitude))
        .then((res) => {
                onSuccess(res)
            }
        )
        .catch((err) => {
            onError(err)
        })
}

/**
 * Look for addresses given a query.
 *
 * See {@link https://nominatim.org/release-docs/develop/api/Search/}
 *
 * @param {string} address
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const getNominatimAddress = (address, onSuccess, onError) => {
    axios
        .get(nominatimSearchAddressURL(address))
        .then((res) => {
                onSuccess(res)
            }
        )
        .catch((err) => {
            onError(err)
        })
}

/**
 * Retrieve a profile image of a Google Account
 *
 * @param {string} imageUrl
 * @param {function()} onSuccess
 * @param {function()} onError
 */
export const getGoogleProfileImage = (imageUrl, onSuccess, onError) => {
    axios
        .get(
            imageUrl,
            {responseType: 'blob'})
        .then((res) => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        })
}