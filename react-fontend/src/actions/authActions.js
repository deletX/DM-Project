import {AUTH_ERROR, AUTH_LOGOUT, AUTH_START, AUTH_SUCCESS} from "./types";
import {handleError, handleSuccess} from "../utils/utils";
import {clearProfileData, fetchProfile} from "./profileActions";
import {clearNotifications, retrieveNotifications} from "./notificationsActions";
import {postAuthLogin, postAuthSignup, postGoogleOAuthLogin, postRefreshAuth} from "../utils/api";

/**
 * Start Action
 *
 * @return {{type: string}}
 */
const start = () => ({
    type: AUTH_START,
});

/**
 * Success Action
 *
 * @param {string} token Access token
 *
 * @return {{type: string, token: string}}
 */
const success = (token) => ({
    type: AUTH_SUCCESS,
    token: token
});

/**
 * Fail Action
 *
 * @return {{type: string}}
 */
const fail = () => ({
    type: AUTH_ERROR
});

/**
 * Logout Action
 *
 * @return {{type: string}}
 */
const logout = () => {
    localStorage.clear();
    return {
        type: AUTH_LOGOUT
    };
};

/**
 * Dispatches a refresh authentication action after `expirationTime` seconds
 *
 * @param {number} expirationTime
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): void}
 */
const checkAuthTimeout = (expirationTime, enqueueSnackbar) => dispatch => {
    const refresh_token = localStorage.getItem("refresh_token")
    setTimeout(() => {
        dispatch(refreshAuth(refresh_token, enqueueSnackbar));
    }, expirationTime * 1000);
};

/**
 * Dispatches a refresh of the authentication tokens with the given refresh token
 *
 * @param {string} refresh_token
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const refreshAuth = (refresh_token, enqueueSnackbar) => {
    return async (dispatch) => {
        return postRefreshAuth(refresh_token,
            (res) => {
                let access_token = res.data.access_token;
                let refresh_token = res.data.refresh_token;
                let expirationDate = new Date(new Date().getTime() + 3600 * 1000);

                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                localStorage.setItem("expiration_date", expirationDate);

                dispatch(success(access_token));
                dispatch(fetchProfile(enqueueSnackbar));
                dispatch(retrieveNotifications(enqueueSnackbar));
                dispatch(checkAuthTimeout(3600, enqueueSnackbar));
            },
            (err) => {
                dispatch(fail(err));
                handleError(enqueueSnackbar, "Something went wrong while refreshing your authentication [019]", err)
                return err;
            })
    };
}

/**
 * Dispatches the application authentication action with the google token
 *
 * @param {string} google_token
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const googleOAuthLogin = (google_token, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        return postGoogleOAuthLogin(google_token,
            (res) => {
                let access_token = res.data.access_token;
                let refresh_token = res.data.refresh_token;
                let expirationDate = new Date(new Date().getTime() + 3600 * 1000); //1h from now

                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                localStorage.setItem("expiration_date", expirationDate);

                dispatch(success(access_token));
                dispatch(retrieveNotifications(enqueueSnackbar));
                dispatch(checkAuthTimeout(3600, enqueueSnackbar));
                dispatch(fetchProfile(enqueueSnackbar));

                handleSuccess(enqueueSnackbar, "Logged in with Google successfully!")
            },
            (err) => {
                dispatch(fail(err));
                handleError(enqueueSnackbar, "Something went wrong while logging in with Google [020]", err)
                return err;
            })
    };
}

/**
 * Dispatches the application authentication action with username and password
 *
 * @param {string} username
 * @param {string} password
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const authLogin = (username, password, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        return postAuthLogin(username, password,
            (res) => {
                let access_token = res.data.access_token;
                let refresh_token = res.data.refresh_token;
                let expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                localStorage.setItem("expiration_date", expirationDate);
                dispatch(success(access_token));
                dispatch(checkAuthTimeout(3600, enqueueSnackbar));
                dispatch(retrieveNotifications(enqueueSnackbar));
                handleSuccess(enqueueSnackbar, "Logged in successfully!")
                return dispatch(fetchProfile(enqueueSnackbar));
            },
            (err) => {
                dispatch(fail(err));
                handleError(enqueueSnackbar, "Something went wrong while logging in [021]", err)
                return err;
            })
    };
}

/**
 * Dispatches the signup (and login afterwards) application
 *
 * @param {string} username
 * @param {string} first_name
 * @param {string} last_name
 * @param {string} email
 * @param {string} password
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<void>}
 */
export const authSignup = (username, first_name, last_name, email, password, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        return postAuthSignup(username, first_name, last_name, email, password,
            () => {
                handleSuccess(enqueueSnackbar, "Successfully signed up")
                return dispatch(authLogin(username, password, enqueueSnackbar))
            },
            (err) => {
                dispatch(fail(err));
                handleError(enqueueSnackbar, "Something went wrong while signing up [022]", err)
                return err;
            })
    };
}

/**
 * Verifies that expiration date of the access token and if it is still valid logins retrieves data otherwise
 * clears stored data
 *
 * @param {enqueueSnackbar} enqueueSnackbar
 *
 * @return {function(*): Promise<*|undefined>}
 */
export const authCheckState = (enqueueSnackbar) => {
    return async dispatch => {
        const token = localStorage.getItem("access_token");
        if (token !== undefined) {
            const expirationDate = new Date(localStorage.getItem("expiration_date"));
            if (expirationDate <= new Date()) {
                dispatch(authLogout());
            } else {
                dispatch(success(token));
                dispatch(retrieveNotifications(enqueueSnackbar)).catch((error) => {
                    console.log("retrieveNotifications error: ",error)
                    return dispatch(authLogout())
                });
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000, enqueueSnackbar));
                return dispatch(fetchProfile(enqueueSnackbar)).catch((error) => {
                    console.log("fetchProfile error: ",error)
                    return dispatch(authLogout())
                });
            }
        }
    };
};

/**
 * Dispatches the application logout action and also the ones to clear stored data
 *
 * @return {function(*): Promise<void>}
 */
export const authLogout = () => {
    return async (dispatch) => {
        dispatch(logout());
        dispatch(clearProfileData());
        dispatch(clearNotifications());
    };
}

