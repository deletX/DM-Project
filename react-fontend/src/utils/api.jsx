import axios from "axios";
import {
    eventDetailURL,
    eventRunURL,
    participationEditURL,
    createFeedbackURL,
    eventCreateURL,
    eventJoinURL,
    eventListURL,
    editFeedbackURL,
    profilesURL,
    currentProfileURL,
    signupURL,
    tokenURL,
    convertTokenURL,
    notificationListURL,
    notificationEditURL,
    carsListURL,
    carsDetailURL,
    nominatimCoordinatesToAddressURL,
    nominatimSearchAddressURL
} from "../constants/apiurls";
import {headers} from "./utils";
import {APP_CLIENTID, APP_SECRET} from "../constants/constants";
import * as qs from "qs";

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

export const getEventsList = (joinable, joined, owned, token, onSuccess, onError) => {
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
            //addAlert("An error occurred while retrieving event data",)
        })
}

export const postCreateEvent = (token, data, image, onSuccess, onError) => {
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
}

export const postJoinEvent = (eventId, starting_address, starting_pos, car, token, onSuccess, onError) => {
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

export const putEditFeedback = (eventId, receiverId, feedbackId, comment, vote, token, onSuccess, onError) => {
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
}


export const getProfileImage = (imageUrl, onSuccess, onError) => {
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

export const getProfileData = (profileId, token, onSuccess, onError) => {
    axios
        .get(profilesURL(profileId),
            headers('application/json', token))
        .then((res) => {
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
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

export const deleteProfile = (token, onSuccess, onError) => {
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
}

export const putChangeProfilePicture = (formData, token, onSuccess, onError) => {
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
}

export const putChangeUserData = (data, token, onSuccess, onError) => {
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
        });
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

export const postAuthSignup = (username, firstName, lastName, email, password, onSuccess, onError) => {
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
            onSuccess(res)
        })
        .catch(err => {
            onError(err)
        });
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

