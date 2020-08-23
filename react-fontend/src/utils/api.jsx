import axios from "axios";
import {eventDetailURL, eventRunURL, participationEditURL, createFeedbackURL} from "../constants/apiurls";
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

export const leaveEvent = (eventId, partecipationId, token, onSuccess, onError) => {
    axios
        .delete(
            participationEditURL(eventId, partecipationId),
            headers('application/json', token)
        )
        .then(res => {
            onSuccess(res)
        })
        .catch(err => {
            //console.log(err)
            onError(err)
            //addAlert("Something went wrong while leaving", "error")
        })
}

export const deleteEvent = (eventId, token, onSuccess, onError) => {
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
}

export const postCreateFeedback = (eventId, receiver, comment, vote, token, onSuccess, onError) => {
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
            //handleError("Something went wrong while posting your feedback [014]", error)
        })
}