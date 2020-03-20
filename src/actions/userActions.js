import {request} from "../utils"
import {
    FETCH_EVENTS_FAILURE,
    FETCH_EVENTS_SUCCESS,
    FETCH_PROFILE, FETCH_PROFILE_ERROR,
    FETCH_PROFILE_FAILURE,
    FETCH_PROFILE_SUCCESS,
    LOGIN, LOGIN_SUCCESSFUL,
    LOGOUT
} from "./types";
import {CLIENTID} from "../constants";

/**
 * Action
 * performs login through Django Rest Framework (saves login data in redux and calls DRJ in orther to create user if new)
 *
 */
export const login = () => dispatch => {
    dispatch({type: LOGIN});
    let user_data;

    if (window.localStorage.getItem("auth") !== null) {
        user_data = JSON.parse(window.localStorage.getItem("auth"));
        console.log("STORED DATA");
        console.log(user_data);
        return dispatch({type: LOGIN_SUCCESSFUL, payload: user_data});

    } else {
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
                client_id: CLIENTID
            }).then(() => {
                window.gapi.auth2.getAuthInstance().signIn().then((res) => {
                    let request = res;
                    user_data = {
                        access_token: request.uc.access_token,
                        user_data: {
                            name: request.Qt.IW,
                            surname: request.Qt.IU,
                            mail: request.Qt.zu,
                            username: request.Qt.zu.replace(/@.*$/, "")
                        }
                    };
                    console.log("LOGIN  ACTION");

                    // gets app_token that won't be used. This call is made so the server creates it if it is a first time log-in (this User and Profile are created)
                    fetch("/api/v0.1/auth/convert-token", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: `grant_type=convert_token&client_id=p4qU0b0ACHWcjajdkYrpihJykmQTW2TELTQupwXx&client_secret=zT15kpJMkkC5b6BtZhSc9VjmVPHVLuCedk3J2h0J29YtRWOkjTwbCQjfVwCP8OdZs26h9s4E6uidZJ9hf6d0AsJr2L2j1z8wQ1QWgihEEvlfDxXdBtPH2mXcZGhWsHPl&backend=google-oauth2&token=${user_data.access_token}`
                    }).then(res => {
                        //TODO verify eventual errors
                        console.log(res);
                        res.json().then(json => {
                            console.log(json);
                            user_data.access_token = json.access_token;
                            user_data.user_data.id = json.user;
                            console.log(user_data);
                            let storage = window.localStorage;
                            storage.setItem("auth", JSON.stringify(user_data));
                            console.log("CRETED DATA");
                            console.log(user_data);
                            return dispatch({type: LOGIN_SUCCESSFUL, payload: user_data})
                        })
                    });
                })
            })
        })

    }
};

/**
 * Action
 * dispatches the logout
 */
export const logout = () => dispatch => {
    let storage = window.localStorage;
    storage.clear();
    dispatch({type: LOGOUT})
};

/**
 * Action
 * API call that loads the current profile user data.
 *
 * @param {string} access_token
 *
 */
export const fetchProfile = (access_token, id) => dispatch => {
    dispatch({type: FETCH_PROFILE});
    return request(
        `/api/v0.1/profile/${id}/`,
        (json) => {
            console.log(json);
            dispatch({type: FETCH_PROFILE_SUCCESS, payload: json})
        },
        (err) => {
            console.error(err);
            dispatch({type: FETCH_PROFILE_ERROR, payload: err})
        },
        (ex) => {
            console.error(ex);
            dispatch({type: FETCH_PROFILE_FAILURE, payload: ex})
        }
        , {headers: {"Authorization": `Bearer ${access_token}`}})
};
