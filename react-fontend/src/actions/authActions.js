import axios from "axios";
import {convertTokenURL, tokenURL, signupURL} from "../constants/apiurls";
import {alertError, removeAllAlerts} from './alertActions';
import {AUTH_ERROR, AUTH_LOGOUT, AUTH_START, AUTH_SUCCESS} from "./types";
import loginURL from "../constants/apiurls";
import {APP_CLIENTID, APP_SECRET} from "../constants/constants";
import * as qs from "qs";
import {headers} from "../utils";
import {clearProfileData, fetchProfile} from "./profileActions";
import {clearNotifications, retrieveNotifications} from "./notificationsActions";

const start = () => ({
    type: AUTH_START,
});

const success = (token) => ({
    type: AUTH_SUCCESS,
    token: token
});

const fail = () => ({
    type: AUTH_ERROR
});

const logout = () => {
    localStorage.clear();
    return {
        type: AUTH_LOGOUT
    };
};

const checkAuthTimeout = (expirationTime) => dispatch => {
    const refresh_token = localStorage.getItem("refresh_token")
    setTimeout(() => {
        dispatch(refreshAuth(refresh_token));
    }, expirationTime * 1000);
};

export const refreshAuth = (refresh_token) => (dispatch) => {
    return axios
        .post(
            tokenURL(),
            qs.stringify({
                client_id: APP_CLIENTID,
                client_secret: APP_SECRET,
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
            }),
            headers('application/x-www-form-urlencoded')
        )
        .then(res => {
            let access_token = res.data.access_token;
            let refresh_token = res.data.refresh_token;
            let expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("expiration_date", expirationDate);
            dispatch(success(access_token));
            dispatch(fetchProfile());
            dispatch(retrieveNotifications());
            dispatch(checkAuthTimeout(3600));
        })
        .catch(error => {
            dispatch(fail(error));
            dispatch(alertError(error));
            return error;
        });
};

export const googleOAuthLogin = (google_token) => (dispatch) => {
    dispatch(start());

    return axios
        .post(
            convertTokenURL(),
            qs.stringify({
                client_id: APP_CLIENTID,
                client_secret: APP_SECRET,
                grant_type: 'convert_token',
                backend: 'google-oauth2',
                token: google_token
            }),
            headers("application/x-www-form-urlencoded")
        )
        .then(res => {
            let access_token = res.data.access_token;
            let refresh_token = res.data.refresh_token;
            let expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("expiration_date", expirationDate);
            dispatch(success(access_token));
            dispatch(retrieveNotifications());
            dispatch(checkAuthTimeout(3600));
            return dispatch(fetchProfile());
        })
        .catch(error => {
            dispatch(fail(error));
            dispatch(alertError(error));
            return error;
        });
};

export const authLogin = (username, password) => (dispatch) => {
    dispatch(start());

    return axios
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
            let access_token = res.data.access_token;
            let refresh_token = res.data.refresh_token;
            let expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("expiration_date", expirationDate);
            dispatch(success(access_token));
            dispatch(checkAuthTimeout(3600));
            dispatch(retrieveNotifications());
            return dispatch(fetchProfile());


        })
        .catch(error => {
            dispatch(fail(error));
            dispatch(alertError(error));
            return error;
        });
};


export const authSignup = (username, first_name, last_name, email, password) => (dispatch) => {
    dispatch(start());
    // we return the promise in order to use wait till the end using "then"
    return axios
        .post(
            signupURL(),
            {
                username: username,
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password
            },
            headers('application/json')
        )
        .then(res => {
            return dispatch(authLogin(username, password))
        })
        .catch(error => {
            dispatch(fail(error));
            dispatch(alertError(error));
            return error;
        });
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem("access_token");
        if (token !== undefined || token !== null) {
            const expirationDate = new Date(localStorage.getItem("expiration_date"));
            if (expirationDate <= new Date()) {
                dispatch(authLogout());
            } else {
                dispatch(success(token));
                dispatch(retrieveNotifications()).catch((error) => {
                    console.log(error)
                    return dispatch(authLogout())
                });
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
                return dispatch(fetchProfile()).catch((error) => {
                    console.log(error)
                    return dispatch(authLogout())
                });
            }
        }
    };
};

export const authLogout = () => dispatch => {
    dispatch(logout());
    // dispatch(removeAllAlerts());
    dispatch(clearProfileData());
    dispatch(clearNotifications());
};

