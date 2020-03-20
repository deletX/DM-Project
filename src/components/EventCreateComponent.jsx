import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchEvents, postEvent, postParticipant} from "../actions/eventActions";
import {CLIENTID, urls} from "../constants";
import {fetchProfile, login} from "../actions/userActions";
import DateTimePicker from "react-datetime-picker";
import RequireLogin from "./RequireLogin";
import {hideJoinErrorAlert} from "../actions/uiActions";
import LoadingComponent from "./LoadingComponent";
import {Redirect} from "react-router-dom";

/**
 * Component containing the logic to create a new event
 */
class EventCreateComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: "",
            address: "",
            destination: "SRID=4326;POINT (44.629418 10.948245)", //TODO change this with nominatim when map implemented
            date_time: undefined,
            // errors: {
            //     name: false,
            //     description: false,
            //     address: false,
            // }
        };
    }


    submit() {

        let event = {
            owner: this.props.id,
            description: this.state.description,
            address: this.state.address,
            name: this.state.name,
            date_time: this.state.date_time,
        };

        console.log(event);
        this.props.postEvent(event, this.props.access_token)
    }


    render() {
        if (this.props.access_token === undefined && !this.props.userIsLoading) {
            return (
                <RequireLogin/>
            )
        }

        //if there's some loading going on show a Loading spinner
        if (this.props.newEventIsLoading || this.props.isLoading || this.props.userIsLoading) {
            return (
                <LoadingComponent/>
            )
        }

        //if the successAlert is to be shown it means the request was successful and a Redirect is issued to urls.events
        if (this.props.showCreateSuccessAlert) {
            return <Redirect to={`${urls.events}`}/>
        }

        const isEnabled = (this.state.name.length > 0 && this.state.description.length > 0 &&
            this.state.destination.length > 0 && this.state.date_time !== undefined);

        return (<form>
            <div className="form-group">
                {this.props.showCreateErrorAlert &&
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Whops!</strong> Something went wrong with your request!
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                            onClick={this.props.hideJoinErrorAlert}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                }
                <label htmlFor="event-name-input">Event name</label>
                <input className="form-control form-control-lg"
                       id="event-name-input" type="text"
                       placeholder="Nome dell'Evento" onChange={name => this.updateName(name)} value={this.state.name}/>

                <label htmlFor="event-description-input">Event description</label>
                <textarea className="form-control"
                          id="event-description-input" rows="3"
                          onChange={descr => this.updateDescr(descr)} value={this.state.description}/>

                <label htmlFor="event-map-input">Event address</label>
                <input className="form-control form-control-lg"
                       id="event-map-input" type="text"
                       placeholder="Indirizzo" onChange={addr => this.updateAddr(addr)} value={this.state.address}/>
                <label htmlFor="event-date-time-input">Event date and time</label>
                <DateTimePicker name="event-date-time-input" onChange={date_time => this.updateDateTime(date_time)}
                                value={this.state.date_time} minDate={new Date()} format="dd/MM/yyyy HH:mm"
                                locale="it" dayPlaceholder="dd" monthPlaceholder="mm" yearPlaceholder="yyyy"
                                hourPlaceholder="hh" minutePlaceholder="mm" required={true}/>
            </div>
            <button className="btn btn-primary" onClick={this.submit.bind(this)} disabled={!isEnabled}>Submit</button>
        </form>)
    }

    updateName(name) {
        this.setState({
            name: name.target.value,
        })
    }

    updateDescr(descr) {
        this.setState({
            description: descr.target.value
        })
    }

    updateDateTime(date_time) {
        this.setState({
            date_time: date_time
        });
        console.log(date_time)
    }

    updateAddr(addr) {
        this.setState({
            address: addr.target.value
        })
    }
}

EventCreateComponent.propTypes = {
    access_token: PropTypes.string,
    newEventIsLoading: PropTypes.bool,
    postParticipant: PropTypes.func,
    isLoading: PropTypes.bool,
    id: PropTypes.number,
    showCreateErrorAlert: PropTypes.bool,
    showCreateSuccessAlert: PropTypes.bool,
    userIsLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
    userIsLoading: state.user.isLoading,
    access_token: state.user.access_token,
    newEventIsLoading: state.events.newEvent.isLoading,
    isLoading: state.events.isLoading,
    id: state.user.user_data.id,
    showCreateErrorAlert: state.ui.showCreateErrorAlert,
    showCreateSuccessAlert: state.ui.showCreateSuccessAlert,
});

export default connect(mapStateToProps, {
    postEvent,
})(EventCreateComponent);
