import React from "react";
import {CLIENTID, urls} from "../constants";
import GoogleLogin from "react-google-login";
import * as actions from "../actions/userActions"

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {userActions} from '../actions/userActions';
import {login} from "../actions/userActions";
import {logout} from "../actions/userActions";
import LoadingComponent from "./LoadingComponent";
import {loginGoogleButton} from "../actions/userActions";
import {Redirect} from "react-router-dom";

class LoginLogoutButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
        }
    }


    onClick() {
        this.props.login();
    }

    logout() {
        this.props.logout();
        this.setState({redirect: true})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.redirect === true) {
            this.setState({redirect: false})
        }
    }

    componentDidMount() {
        this.setState({redirect: false});
        if (this.props.access_token === undefined) {
            if (window.localStorage.getItem("auth") !== null) {
                this.props.login();
            }
        }
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (this.props.access_token === undefined && !this.props.isLoading) {
    //         localStorage.clear();
    //         window.gapi.signin2.render('loginBtn', {
    //             'scope': 'profile email',
    //             'width': 135,
    //             'height': 40,
    //             'longtitle': false,
    //             'theme': 'light',
    //             'onsuccess': this.onSuccess.bind(this),
    //         })
    //     }
    // }


    render() {
        if (this.state.redirect) {
            return (<Redirect push to={urls.events}/>)
        }
        if (this.props.access_token === undefined) {
            if (this.props.isLoading)
                return <LoadingComponent/>;
            return <div className="btn btn-outline-dark" onClick={() => {
                this.onClick()
            }} role="button"
                        style={{textTransform: "none"}}>
                <img width="20px" style={{marginBottom: "3px", marginRight: "5px"}} alt="Google sign-in"
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"/>
                Login with Google
            </div>

        } else {
            return <div id="logoutBtn" className="btn btn-outline-secondary my-2 my-sm-0" type="submit"
                        onClick={this.logout.bind(this)}> Logout</div>
        }
    }
}


LoginLogoutButton.propTypes = {
    // loginGoogleButton: PropTypes.func.isRequired,
    login: PropTypes.func,
    logout: PropTypes.func.isRequired,
    access_token: PropTypes.string,
    isLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
    access_token: state.user.access_token,
    isLoading: state.user.isLoading,
});

export default connect(mapStateToProps, {/*loginGoogleButton,*/login, logout})(LoginLogoutButton);