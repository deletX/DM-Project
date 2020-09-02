import {AUTH_ERROR, AUTH_LOGOUT, AUTH_START, AUTH_SUCCESS} from "./types";
import {handleError, handleSuccess} from "../utils/utils";
import {clearProfileData, fetchProfile} from "./profileActions";
import {clearNotifications, retrieveNotifications} from "./notificationsActions";
import {postAuthLogin, postAuthSignup, postGoogleOAuthLogin, postRefreshAuth} from "../utils/api";

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

const checkAuthTimeout = (expirationTime, enqueueSnackbar) => dispatch => {
    const refresh_token = localStorage.getItem("refresh_token")
    setTimeout(() => {
        dispatch(refreshAuth(refresh_token, enqueueSnackbar));
    }, expirationTime * 1000);
};

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
                handleError(enqueueSnackbar, "Something went wrong while refreshing your authentication", err)
                return err;
            })
    };
}

export const googleOAuthLogin = (google_token, enqueueSnackbar) => {
    return async (dispatch) => {
        dispatch(start());
        return postGoogleOAuthLogin(google_token,
            (res) => {
                let access_token = res.data.access_token;
                let refresh_token = res.data.refresh_token;
                let expirationDate = new Date(new Date().getTime() + 3600 * 1000);
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
                handleError(enqueueSnackbar, "Something went wrong while logging in with Google", err)
                return err;
            })
    };
}

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
                handleError(enqueueSnackbar, "Something went wrong while logging in", err)
                return err;
            })
    };
}

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
                handleError(enqueueSnackbar, "Somethign went wrong while signing up", err)
                return err;
            })
    };
}

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
                    console.log(error)
                    return dispatch(authLogout())
                });
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000, enqueueSnackbar));
                return dispatch(fetchProfile(enqueueSnackbar)).catch((error) => {
                    console.log(error)
                    return dispatch(authLogout())
                });
            }
        }
    };
};

export const authLogout = () => {
    return async (dispatch) => {
        dispatch(logout());
        dispatch(clearProfileData());
        dispatch(clearNotifications());
    };
}

