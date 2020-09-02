import {AUTH_ERROR, AUTH_LOGOUT, AUTH_START, AUTH_SUCCESS} from './types';
import {handleError} from '../utils/utils';
import {clearProfileData, fetchProfile} from './profileActions';
import {clearNotifications, retrieveNotifications} from './notificationsActions';
import AsyncStorage from '@react-native-community/async-storage';
import {postAuthLogin, postGoogleOAuthLogin, postRefreshAuth} from "../utils/api";

/**
 * Start authentication action object
 *
 * @returns {{type: string}}
 */
const start = () => ({
    type: AUTH_START,
});

/**
 * Authentication success action object
 *
 * @param {string} token retrieved application token
 *
 * @returns {{type: string, token: string}}
 */
const success = (token) => ({
    type: AUTH_SUCCESS,
    token: token,
});

/**
 * Authentication fail action object
 *
 * @returns {{type: string}}
 */
const fail = () => ({
    type: AUTH_ERROR,
});

/**
 * Logout action object.
 * Clear all the stored information
 *
 * @returns {{type: string}}
 */
const logout = () => {
    AsyncStorage.clear();
    return {
        type: AUTH_LOGOUT,
    };
};

/**
 * Refresh authentication through the refresh token if the authentication expired
 *
 * @param {string} refresh_token
 *
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export const refreshAuth = (refresh_token) => {
    return async (dispatch) => {
        return postRefreshAuth(refresh_token,
            (res) => {
                let access_token = res.data.access_token;
                let refresh_token = res.data.refresh_token;

                AsyncStorage.setItem('access_token', access_token);
                AsyncStorage.setItem('refresh_token', refresh_token);

                dispatch(success(access_token));
                dispatch(fetchProfile());
                dispatch(retrieveNotifications());
            },
            (err) => {
                dispatch(fail(err));
                // There is no need to comunicate to the user since this will be executed when the app is opened mainly
                // handleError("Something went wrong [001]",error)
                return err;
            })
        // return axios
        //     .post(
        //         tokenURL(),
        //         qs.stringify({
        //             client_id: APP_CLIENTID,
        //             client_secret: APP_SECRET,
        //             grant_type: 'refresh_token',
        //             refresh_token: refresh_token,
        //         }),
        //         headers('application/x-www-form-urlencoded'),
        //     )
        //     .then((res) => {
        //         let access_token = res.data.access_token;
        //         let refresh_token = res.data.refresh_token;
        //
        //         AsyncStorage.setItem('access_token', access_token);
        //         AsyncStorage.setItem('refresh_token', refresh_token);
        //
        //         dispatch(success(access_token));
        //         dispatch(fetchProfile());
        //         dispatch(retrieveNotifications());
        //     })
        //     .catch((error) => {
        //         dispatch(fail(error));
        //         // There is no need to comunicate to the user since this will be executed when the app is opened mainly
        //         // handleError("Something went wrong [001]",error)
        //         return error;
        //     });
    };
};

/**
 * Authentication action through Google
 *
 * @param {string} google_token
 *
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export const googleOAuthLogin = (google_token) => {
    return async (dispatch) => {
        dispatch(start());
        return postGoogleOAuthLogin(google_token,
            (res) => {
                let access_token = res.data.access_token;
                let refresh_token = res.data.refresh_token;

                AsyncStorage.setItem('access_token', access_token);
                AsyncStorage.setItem('refresh_token', refresh_token);

                dispatch(success(access_token));
                dispatch(retrieveNotifications());
                dispatch(fetchProfile());
            },
            (err) => {
                dispatch(fail(err));
                handleError("Something went wrong while logging in [004]", err)
                return err;
            })
        // return axios
        //     .post(
        //         convertTokenURL(),
        //         qs.stringify({
        //             client_id: APP_CLIENTID,
        //             client_secret: APP_SECRET,
        //             grant_type: 'convert_token',
        //             backend: 'google-oauth2',
        //             token: google_token,
        //         }),
        //         headers('application/x-www-form-urlencoded'),
        //     )
        //     .then((res) => {
        //         let access_token = res.data.access_token;
        //         let refresh_token = res.data.refresh_token;
        //
        //         AsyncStorage.setItem('access_token', access_token);
        //         AsyncStorage.setItem('refresh_token', refresh_token);
        //
        //         dispatch(success(access_token));
        //         dispatch(retrieveNotifications());
        //         dispatch(fetchProfile());
        //     })
        //     .catch((error) => {
        //         dispatch(fail(error));
        //         handleError("Something went wrong while logging in [004]", error)
        //         return error;
        //     });
    };
};

/**
 * Username and password authentication action
 *
 * @param {string} username
 * @param {string} password
 *
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export const authLogin = (username, password) => {
    return async (dispatch) => {
        dispatch(start());
        return postAuthLogin(username, password,
            (res) => {
                let access_token = res.data.access_token;
                let refresh_token = res.data.refresh_token;

                AsyncStorage.setItem('access_token', access_token);
                AsyncStorage.setItem('refresh_token', refresh_token);

                dispatch(success(access_token));
                dispatch(retrieveNotifications());
                return dispatch(fetchProfile());
            },
            (err) => {
                handleError("Incorrect username and/or password! [005]", err)
                dispatch(fail(err))
                return err;
            })
        // return axios
        //     .post(
        //         tokenURL(),
        //         qs.stringify({
        //             client_id: APP_CLIENTID,
        //             client_secret: APP_SECRET,
        //             grant_type: 'password',
        //             username: username,
        //             password: password,
        //         }),
        //         headers('application/x-www-form-urlencoded'),
        //     )
        //     .then((res) => {
        //         let access_token = res.data.access_token;
        //         let refresh_token = res.data.refresh_token;
        //
        //         AsyncStorage.setItem('access_token', access_token);
        //         AsyncStorage.setItem('refresh_token', refresh_token);
        //
        //         dispatch(success(access_token));
        //         dispatch(retrieveNotifications());
        //         return dispatch(fetchProfile());
        //     })
        //     .catch((err) => {
        //         handleError("Incorrect username and/or password! [005]", err)
        //         return err;
        //     });
    };
};

/**
 * Check if is authenticated (has an access_token stored) then run the refresh
 *
 * @returns {function(...[*]=)}
 */
export const authCheckState = () => {
    return async (dispatch) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token !== null) {
            const refresh = await AsyncStorage.getItem('refresh_token');
            dispatch(refreshAuth(refresh));
        }
    };
};

/**
 * Logout action flow
 *
 * @returns {function(...[*]=)}
 */
export const authLogout = () => {
    return async (dispatch) => {
        dispatch(logout());
        dispatch(clearProfileData());
        dispatch(clearNotifications());
    };
};
