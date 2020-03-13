import {request} from "../utils"
import {LOGIN, LOGOUT} from "./types";

export const login = request => dispatch => {
    // gets app_token that won't be used. This call is made so the server creates it if it is a first time log-in (this User and Profile are created)
    fetch("/api/v0.1/auth/convert-token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "grant_type=convert_token&client_id=p4qU0b0ACHWcjajdkYrpihJykmQTW2TELTQupwXx&client_secret=zT15kpJMkkC5b6BtZhSc9VjmVPHVLuCedk3J2h0J29YtRWOkjTwbCQjfVwCP8OdZs26h9s4E6uidZJ9hf6d0AsJr2L2j1z8wQ1QWgihEEvlfDxXdBtPH2mXcZGhWsHPl&backend=google-oauth2&token=${request.uc.access_token}",
    });

    let user_data = {
        access_token: request.uc.access_token,
        user_data: {
            name: request.Qt.IW,
            surname: request.Qt.IU,
            mail: request.Qt.zu
        }
    };
    dispatch({type: LOGIN, payload: user_data})
};

export const logout = () => dispatch => {
    dispatch({type: LOGOUT})
};

