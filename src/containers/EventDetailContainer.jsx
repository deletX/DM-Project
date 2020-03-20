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
import {fetchProfile, login} from "../actions/userActions";
import RequireLogin from "../components/RequireLogin";
import LoadingComponent from "../components/LoadingComponent";
import {status} from "../constants"
import {request} from "../utils";
import {RUN_EVENT_ERROR, RUN_EVENT_FAILURE, RUN_EVENT_SUCCESS} from "../actions/types";

class EventDetailContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
        }
    }

    componentDidMount() {
        if (this.props.access_token === undefined) {
            this.props.login();
        }
        if (this.props.access_token !== undefined) {
            this.props.fetchEvent(this.state.id, this.props.access_token)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.newEvent.event.name === undefined && this.props.access_token !== undefined && !this.props.newEvent.isLoading) {
            this.props.fetchEvent(this.state.id, this.props.access_token)
        }
    }

    render() {
        //if there's some loading going on show a Loading spinner
        if (this.props.access_token === undefined || this.props.newEvent.isLoading || this.props.newEvent.event.name === undefined) {
            return (
                <LoadingComponent/>
            )
        }

        let participantItems = this.props.newEvent.event.participant_set.map(participant => (
            <li key={participant.id}>
                {participant.user.user} {participant.car != null ? "🚗"/*emoji auto*/ : ""}
            </li>
        ));
        return (
            <div id="event-detail">
                <div>
                    {status[this.props.newEvent.event.status - 1]}
                </div>
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

                {this.props.newEvent.event.owner === this.props.id && this.props.newEvent.event.status === 1 &&
                <div className="btn btn-primary btn-sm" onClick={() => {
                    this.compute()
                }}> Compute </div>
                }

            </div>
        )

    }

    compute() {
        request(
            `/api/v0.1/events/${this.state.id}/run`,
            (json) => {
                this.props.fetchEvent(this.state.id, this.props.access_token)

            },
            (err) => {
                console.error(err);
            },
            (ex) => {
                console.error(ex);
            },
            {
                headers: {"Authorization": `Bearer ${this.props.access_token}`},
            })

    }


}

EventDetailContainer.propTypes = {
    access_token: PropTypes.string,
    fetchEvent: PropTypes.func,
    newEvent: PropTypes.object,
    login: PropTypes.func,
    id: PropTypes.number,
};

const mapStateToProps = state => ({
    id: state.user.user_data.id,
    access_token: state.user.access_token,
    newEvent: state.events.newEvent,
});

export default connect(mapStateToProps, {login, fetchEvent})(EventDetailContainer);
