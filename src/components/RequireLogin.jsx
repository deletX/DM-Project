import React from "react";
import {CLIENTID, urls} from "../constants";
import GoogleLogin from "react-google-login";
import * as actions from "../actions/userActions"

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {userActions} from '../actions/userActions';
import {login} from "../actions/userActions";
import {logout} from "../actions/userActions";
import {Redirect} from "react-router-dom";

class LoginLogoutButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
        }
    }

    onSuccess(request) {
        this.props.login(request);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.access_token !== undefined && this.props.access_token === undefined) {
            this.setState({redirect: true})
        }
    }

    componentDidMount() {
        if (this.props.access_token === undefined) {
            this.props.login();
        }
    }


    render() {
        if (this.state.redirect) {
            return <Redirect push to={urls.events}/>
        }
        return <div id="loginBtn-req"/>
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