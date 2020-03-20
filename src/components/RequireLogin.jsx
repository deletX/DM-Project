import React from "react";
import {CLIENTID} from "../constants";
import GoogleLogin from "react-google-login";
import * as actions from "../actions/userActions"

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {userActions} from '../actions/userActions';
import {login} from "../actions/userActions";
import {logout} from "../actions/userActions";

class LoginLogoutButton extends React.Component {

    onSuccess(request) {
        this.props.login(request);

    }

    componentDidMount() {
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
                client_id: CLIENTID
            }).then(() => {
                window.gapi.load('signin2', () => {
                    window.gapi.signin2.render('loginBtn', {
                        'scope': 'profile email',
                        'width': 135,
                        'height': 40,
                        'longtitle': false,
                        'theme': 'light',
                        'onsuccess': this.onSuccess.bind(this),
                    })
                })

            })
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.access_token === undefined) {
            localStorage.clear();
            window.gapi.signin2.render('loginBtn', {
                'scope': 'profile email',
                'width': 135,
                'height': 40,
                'longtitle': false,
                'theme': 'light',
                'onsuccess': this.onSuccess.bind(this),
            })
        }


    }


    render() {
        if (this.props.access_token === undefined) {
            return <div id="loginBtn"/>
        }
    }

}

LoginLogoutButton.propTypes = {
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    access_token: PropTypes.string
};

const mapStateToProps = state => ({
    access_token: state.user.access_token
});

export default connect(mapStateToProps, {login, logout})(LoginLogoutButton);