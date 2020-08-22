import axios from "axios";
import {eventDetailURL, eventRunURL} from "../constants/apiurls";
import {headers} from "./utils";
import {home} from "../constants/pagesurls";


/**
 *
 * @param eventId
 * @param token
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
            onSuccess(res);
        })
        .catch(err => {
            onError(err);
        })
}


export const getEventAxios = (eventId, token, onSuccess, onError) => {
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
            //addAlert("An error occurred while retrieving event data",)
        })
}

export const updateEvent = (eventId, data, token, image, onSuccess, onError) => {
    axios
        .put(
            eventDetailURL(eventId),
            data,
            headers(image !== null ? 'multipart/form-data' : 'application/json', token)
        )
        .then(res => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
            //addAlert(err, "error")
        })
}

export const leaveEvent = () => {

}