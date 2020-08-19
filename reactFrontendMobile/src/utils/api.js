import axios from "axios";
import {eventJoinURL, nominatimCoordinatesToAddressURL, participationEditURL, profilesURL} from "../constants/apiurls";
import {HOME_SCREEN, OTHER_PROFILE_SCREEN} from "../constants/screens";
import {handleError, headers, selectItem} from "./utils";
import {ToastAndroid} from "react-native";

/*
    DMPROJECT API
 */

/**
 * API call to join an event at {@link eventJoinURL}.
 *
 * @param {number} eventID
 * @param {string} token
 * @param {string} startingAddress
 * @param {string} startingPos
 * @param {number} carID
 * @param navigation react-navigation navigation so to navigate to {@link HOME_SCREEN} when successful
 *
 * @return {Promise<void>}
 */
export const postJoinedEvent = async (eventID, token, startingAddress, startingPos, carID, navigation) => {
    axios
        .post(
            eventJoinURL(eventID),
            {
                starting_address: startingAddress,
                starting_pos: startingPos,
                car: carID
            },
            headers('application/json', token)
        )
        .then(res => {
                navigation.navigate(HOME_SCREEN, {refresh: true});

            }
        )
        .catch(err => {
                handleError("Something went wrong while joining the event [013]")
            }
        )
}

/**
 * API call to leave an event, performing a delete at {@link participationEditURL}
 *
 * @param {number} eventID
 * @param {number} token
 * @param participationID
 * @param {function} reload callback called after success
 *
 * @return {Promise<void>}
 */
export const deleteLeaveEvent = async (eventID, token, participationID, reload) => {
    axios
        .delete(
            participationEditURL(eventID, participationID),
            headers('application/json', token)
        )
        .then(res => {
            reload();
        })
        .catch(err => {
            handleError("Something went wrong while leaving [002]", err)
        })

}

export const getProfile = async (feedbackGiverId, token, navigation) => {
    axios
        .get(profilesURL(feedbackGiverId),
            headers('application/json', token))
        .then(res => {
            navigation.navigate(OTHER_PROFILE_SCREEN, {
                id: feedbackGiverId,
                profile: res.data
            })
        })
        .catch(err => {
            handleError("Something went wrong while retrieving the profile", err)
        })
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
                return selectItem(res.data, latitude, longitude);
            }
        )
        .catch((error) => {
            handleError("Something went wrong while getting address of your position [012]", error)
        })


}