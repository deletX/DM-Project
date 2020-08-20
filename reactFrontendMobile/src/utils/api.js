import axios from "axios";
import {
    createFeedbackURL,
    eventDetailURL,
    eventJoinURL, eventListURL,
    eventRunURL,
    nominatimCoordinatesToAddressURL,
    participationEditURL,
    profilesURL
} from "../constants/apiurls";
import {handleError, headers, selectItem} from "./utils";

/*
    DMPROJECT API
 */

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
export const postJoinedEvent = async (eventId, token, startingAddress, startingPos, carId, onSuccess) => {
    axios
        .post(
            eventJoinURL(eventId),
            {
                starting_address: startingAddress,
                starting_pos: startingPos,
                car: carId === -1 ? null : carId
            },
            headers('application/json', token)
        )
        .then(res => {
                onSuccess(res)

            }
        )
        .catch(err => {
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
        })
        .catch(err => {
            handleError("Something went wrong while leaving [002]", err)
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
        .get(profilesURL(id),
            headers('application/json', token))
        .then(res => {
            onSuccess(res);
        })
        .catch(err => {
            handleError("Something went wrong while retrieving the profile [008]", err)
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
        })
        .catch((error) => {
            handleError("Something went wrong while posting your feedback [014]", error)
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
        })
        .catch(err => {
            handleError("Something went wrong while deleting your event [015]", err)
        })
}

/**
 * API call to start the computation (**only the owner can do so**)
 *
 * @param {number} eventId
 * @param {string} token
 * @param {function()} onSuccess
 */
export const runEvent = (eventId, token, onSuccess) => {
    axios
        .get(
            eventRunURL(eventId),
            headers('application/json', token),
        )
        .then(res => {
            onSuccess(res)
        })
        .catch(err => {
            handleError("Something went wrong while launching the computation [016]", err)
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
export const getListEvent = (joinable, joined, owned, token, onSuccess, onError = () => {
}) => {
    axios
        .get(eventListURL(joinable, joined, owned), headers('application/json', token))
        .then((res) => {
            onSuccess(res)
        })
        .catch((err) => {
            handleError("Something went wrong while retrieving the events [017]", err)
            onError()
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

    return axios.get(nominatimCoordinatesToAddressURL(latitude, longitude))
        .then((res) => {
                return selectItem(res.data);
            }
        )
        .catch((error) => {
            handleError("Something went wrong while getting address of your position [012]", error)
        })


}