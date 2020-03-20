import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchEvents, postParticipant} from "../actions/eventActions";
import {CLIENTID, urls} from "../constants";
import {fetchProfile, login} from "../actions/userActions";
import DateTimePicker from "react-datetime-picker";
import LoadingComponent from "./LoadingComponent";
import {forEach} from "react-bootstrap/cjs/ElementChildren";
import {requireLogin} from "../utils";
import {Redirect} from "react-router-dom"
import RequireLogin from "./RequireLogin";
import {hideJoinErrorAlert} from "../actions/uiActions";

/**
 * Component that serves the logic to join an event (i.e. post a new Participant)
 */
class EventJoinComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            pos: "SRID=4326;POINT (44.629418 10.948245)", //TODO change this with nominatim when map implemented
            car: '',
            event: this.props.match.params.id,
        };

        if (this.props.events) {
            this.props.fetchEvents()
        }
    }

    submit() {
        let participant = {
            user: this.props.profile_data.user_id,
            starting_address: this.state.address,
            starting_pos: this.state.pos,
            car: this.state.car,
            event: this.props.match.params.id,
        };

        this.props.postParticipant(participant, this.props.access_token)
    }

    componentDidMount() {
        if (this.props.access_token !== undefined)
            this.props.fetchProfile(this.props.access_token);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.access_token !== undefined && prevProps.access_token !== this.props.access_token) {
            this.props.fetchProfile(this.props.access_token);
        }
    }

    /**
     * Updates local state with the value
     * @param {input-value} addr
     */
    updateAddr(addr) {
        this.setState({
            address: addr.target.value
        })
    }

    render() {
        // Since login is required, through this component it either gets loaded or it is prompted
        if (this.props.access_token === undefined) {
            return (
                <RequireLogin/>
            )
        }

        //if there's some loading going on show a Loading spinner
        if (this.props.profile_data.isLoading || this.props.newParticipantIsLoading || this.props.isLoading) {
            return (
                <LoadingComponent/>
            )
        }

        //if the successAlert is to be shown it means the request was successful and a Redirect is issued to urls.events
        if (this.props.showJoinSuccessAlert) {
            return <Redirect to={`${urls.events}`}/>
        }


        // if user alredy joined event redirect to the detail view of such.
        for (const index in this.props.events) {
            let event = this.props.events[index];
            console.log(event.id);
            console.log(this.state.event);
            if (event.id === parseInt(this.state.event)) {
                if (event.participant_set.includes(this.props.profile_data.user_id)) {
                    return <Redirect to={`${urls.detail_}/${event.id}`}/>
                }
            }
        }

        let carItems = this.props.profile_data.cars.map(car => (
            <option key={car.id} id={car.id} value={car.id}>
                {car.name} [{car.tot_avail_seats} seats]
            </option>
        ));

        // add no Car option
        carItems.push((
            <option key='' id='' value=''>No Car</option>
        ));

        return (
            <div id="join-events">
                <h1>Join Event</h1>
                <form>
                    {this.props.showJoinErrorAlert &&
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Whops!</strong> Something went wrong with your request!
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                                onClick={this.props.hideJoinErrorAlert}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    }
                    <div className="form-group">
                        <label htmlFor="participant-address-input">Indirizzo</label>
                        <input className="form-control form-control-lg" id="participant-address" type="text"
                               placeholder="Indirizzo" value={this.state.address}
                               onChange={addr => this.updateAddr(addr)}/>

                        <span> TODO mappina </span> <br/>

                        <label htmlFor="participant-car-select">Select Car</label>
                        <select className="form-control" id="participant-car-select"
                                onChange={car => this.updateCar(car)} value={this.state.car}>
                            {carItems}
                        </select>
                    </div>
                </form>
                <button className="btn btn-primary" onClick={this.submit.bind(this)}>Submit</button>


            </div>
        )
    }

}

EventJoinComponent.propTypes = {
    access_token: PropTypes.string,
    fetchProfile: PropTypes.func,
    profile_data: PropTypes.object,
    newParticipantIsLoading: PropTypes.bool,
    postParticipant: PropTypes.func,
    events: PropTypes.array,
    fetchEvents: PropTypes.func,
    isLoading: PropTypes.bool,
    showJoinErrorAlert: PropTypes.bool,
    showJoinSuccessAlert: PropTypes.bool,
};

const mapStateToProps = state => ({
    access_token: state.user.access_token,
    profile_data: state.user.profile_data,
    newParticipantIsLoading: state.events.newParticipant.isLoading,
    events: state.events.events,
    isLoading: state.events.isLoading,
    showJoinErrorAlert: state.ui.showJoinErrorAlert,
    showJoinSuccessAlert: state.ui.showJoinSuccessAlert,
});

export default connect(mapStateToProps, {
    fetchProfile,
    postParticipant,
    fetchEvents,
    hideJoinErrorAlert
})(EventJoinComponent);
