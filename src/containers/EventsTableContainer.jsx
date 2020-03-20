import React from "react"
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {forEach} from "react-bootstrap/cjs/ElementChildren";
import {fetchEvents} from "../actions/eventActions";
import EventsTableComponent from "../components/EventsTableComponent";
import LoadingComponent from "../components/LoadingComponent";
import {hideJoinSuccessAlert} from "../actions/uiActions";
import {Redirect} from "react-router-dom";
import {urls} from "../constants";

class EventsTableContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            createRedirect: false,
        }
    }

    componentDidMount() {
        this.props.fetchEvents()
    }

    render() {
        let eventItems = this.props.events.map(event => (
            <EventsTableComponent key={event.id} event={event}/>
        ));

        if (this.state.createRedirect) {
            return <Redirect push to={urls.create}/>
        }

        if (this.props.isLoading) {
            return (
                <LoadingComponent/>
            )
        } else {
            return (
                <div id="events">
                    <h1>Events</h1>
                    {this.props.showCreateSuccessAlert &&
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Yay! Succsessfully Created event</strong>. You can Create some more ore can join it by
                        clicking the join button
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                                onClick={this.props.hideJoinSuccessAlert}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    }
                    {this.props.showJoinSuccessAlert &&
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Yay! Succsessfully joined event</strong>. You can join some more ore can see your joined
                        events by clicking the button above.
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                                onClick={this.props.hideJoinSuccessAlert}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    }
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Date</th>
                            <th scope="col">Destination</th>
                            <th scope="col">Owner</th>
                            <th scope="col">Participants</th>
                            <th scope="col">
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {eventItems}
                        </tbody>
                    </table>

                    {this.props.isSignedIn &&
                    <button id="create-event-btn" type="submit" className="btn btn-info btn-sm"
                            onClick={() => this.setState({createRedirect: true})}>Create Event</button>
                    }
                </div>

            )
        }
    }
}

EventsTableContainer.propTypes = {
    events: PropTypes.array,
    isLoading: PropTypes.bool,
    fetchEvents: PropTypes.func,
    isSignedIn: PropTypes.bool,
    showJoinSuccessAlert: PropTypes.bool.isRequired,
    hideJoinSuccessAlert: PropTypes.func,
    showCreateSuccessAlert: PropTypes.bool,

};

const mapStateToProps = state => ({
    events: state.events.events,
    isLoading: state.events.isLoading,
    isSignedIn: state.user.isSignedIn,
    showJoinSuccessAlert: state.ui.showJoinSuccessAlert,
    showCreateSuccessAlert: state.ui.showCreateSuccessAlert,
});

export default connect(mapStateToProps, {fetchEvents, hideJoinSuccessAlert})(EventsTableContainer);
