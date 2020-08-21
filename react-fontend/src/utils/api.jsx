import axios from "axios";
import {eventRunURL} from "../constants/apiurls";
import {headers} from "./utils";

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