import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {login} from "../actions/userActions";
import {Redirect} from "react-router-dom";
import {urls} from "../constants";

/**
 * Button to Join or view Detail of an event
 *
 * Log-in is required
 */
class JoinDetailButtonComponent extends React.Component {

    constructor(props) {
        super(props);
        let text = "Join";

        if (this.props.event.participant_set.includes(this.props.id)) {
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

        if (props.event.participant_set.includes(props.id)) {
            text = "Detail"
        }

        return {...state, text: text}
    }


    render() {
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
            if (this.state.text === "Join")
                return (
                    <Redirect push to={`${urls.join_}/${this.props.event.id}`}/>
                );
            return <Redirect push to={`${urls.detail_}/${this.props.event.id}`}/>
        }
    }

    //If button is clicked then a redirection is due. If user is not signedIn it is prompted to do so before issuing a redirection.
    onClick() {
        this.setState({...this.state, renderRedirect: true})
    }
}

JoinDetailButtonComponent.propTypes = {
    id: PropTypes.number,
};

const
    mapStateToProps = state => ({
        id: state.user.user_data.id,
    });

export default connect(mapStateToProps, {login})(JoinDetailButtonComponent);
