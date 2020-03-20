import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchProfile, login} from "../actions/userActions";
import {Redirect} from "react-router-dom";
import {CLIENTID, urls} from "../constants";
import LoadingComponent from "./LoadingComponent";
import {hideJoinSuccessAlert} from "../actions/uiActions";

// <button type="submit" className="btn btn-info btn-sm" onClick={this.onClick.bind(this)}>{text}</button>

/**
 * Button to Join or view Detail of an event
 *
 * Log-in is required
 */
class JoinDetailButtonComponent extends React.Component {

    constructor(props) {
        super(props);
        let text = "Join";

        if (!this.props.profile_data.user_id && props.isSignedIn) {
            if (!this.props.profile_data.isLoading)
                this.props.fetchProfile(this.props.access_token);
        } else if (this.props.event.participant_set.includes(this.props.profile_data.user_id)) {
            text = "Detail"
        }

        this.state = {
            text: text,
            renderRedirect: false,
        }
    }

    /**
     * updates the state from the props.
     * It is important since Redux updates the props on which state.text is based
     * @param props
     * @param state
     * @returns {{text: string}} state
     */
    static getDerivedStateFromProps(props, state) {
        let text = "Join";

        if (!props.profile_data.user_id && props.isSignedIn) {
            if (!props.profile_data.isLoading)
                props.fetchProfile(props.access_token);
        } else if (props.event.participant_set.includes(props.profile_data.user_id)) {
            text = "Detail"
        }
        return {...state, text: text}
    }


    render() {

        if (this.props.profile_data.isLoading)
            return (<LoadingComponent/>);
        //
        return (
            <div id="detail-login-btn">
                {this.redirect()}
                <button type="submit" className="btn btn-info btn-sm"
                        onClick={this.onClick.bind(this)}>{this.state.text}</button>
            </div>
        )

    }


    /**
     * determins if a redirect is necessary by looking at state
     * @returns {*}
     */
    redirect() {
        if (this.state.renderRedirect) {
            return (
                <Redirect push to={`${urls.join_}/${this.props.event.id}`}/>
            )
        }
    }

    //If button is clicked then a redirection is due. If user is not signedIn it is prompted to do so before issuing a redirection.
    onClick() {
        if (this.props.isSignedIn) {
            this.setState({...this.state, renderRedirect: true})
        } else {
            window.gapi.load('auth2', () => {
                window.gapi.auth2.init({
                    client_id: CLIENTID
                }).then(() => {
                    window.gapi.auth2.getAuthInstance().signIn().then((res) => {
                        this.props.login(res);
                        this.onClick()
                    })
                })
            })
        }
    }
}

JoinDetailButtonComponent.propTypes = {
    isSignedIn: PropTypes.bool,
    login: PropTypes.func,
    profile_data: PropTypes.object,
    access_token: PropTypes.string,
    fetchProfile: PropTypes.func,
};

const
    mapStateToProps = state => ({
        isSignedIn: state.user.isSignedIn,
        access_token: state.user.access_token,
        profile_data: state.user.profile_data,
    });

export default connect(mapStateToProps, {login, fetchProfile})(JoinDetailButtonComponent);
