import React from "react"
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {forEach} from "react-bootstrap/cjs/ElementChildren";
import {fetchEvent, fetchEvents, postEvent} from "../actions/eventActions";
import EventsTableComponent from "../components/EventsTableComponent";
import EventsTableContainer from "./EventsTableContainer";
import EventJoinComponent from "../components/EventJoinComponent";
import {urls} from '../constants'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import {hideJoinErrorAlert, hideJoinSuccessAlert} from "../actions/uiActions";
import {fetchProfile} from "../actions/userActions";
import RequireLogin from "../components/RequireLogin";
import LoadingComponent from "../components/LoadingComponent";

class EventDetailContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
        }
    }

    componentDidMount() {
        if (this.props.access_token !== undefined)
            this.props.fetchEvent(this.state.id, this.props.access_token);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.access_token !== undefined && prevProps.access_token !== this.props.access_token) {
            this.props.fetchEvent(this.state.id, this.props.access_token);
        }
    }

    render() {
        if (this.props.access_token === undefined) {
            return (<RequireLogin/>)
        }

        if (this.props.newEvent.isLoading || this.props.newEvent.event.name === undefined) {
            return <LoadingComponent/>
        }

        let participantItems = this.props.newEvent.event.participant_set.map(participant => (
            <li key={participant.id}>
                {participant.user}
            </li>
        ));
        return (
            <div id="event-detail">
                <div>
                    {this.props.newEvent.event.name}
                </div>
                <div>
                    {this.props.newEvent.event.description}
                </div>
                <div>
                    {this.props.newEvent.event.address}
                </div>
                <div>
                    {this.props.newEvent.event.date_time}
                </div>

                <div id="event-participants">
                    <ul>
                        {participantItems}
                    </ul>
                </div>

            </div>
        )

    }

}

EventDetailContainer.propTypes = {
    access_token: PropTypes.string,
    fetchEvent: PropTypes.func,
    newEvent: PropTypes.object,
};

const mapStateToProps = state => ({
    access_token: state.user.access_token,
    newEvent: state.events.newEvent,
});

export default connect(mapStateToProps, {fetchEvent})(EventDetailContainer);
