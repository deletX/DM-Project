import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchEvents} from "../actions/eventActions";
import {CLIENTID, urls} from "../constants";
import {fetchProfile, login} from "../actions/userActions";
import {showJoinEvent} from "../actions/uiActions";
import {Redirect} from "react-router-dom";
import JoinDetailButtonComponent from "./JoinDetailButtonComponent";

/**
 * This component creates the Table Row environment, except the Join/Detail Button.
 * Data is passed as prop
 */
export default class EventsTableComponent extends React.Component {


    render() {
        return (<tr>
            <th scope="row!">{this.props.event.name}</th>
            <td>{(new Date(this.props.event.date_time)).toLocaleString()}</td>
            <td>{this.props.event.address}</td>
            <td>{this.props.event.owner}</td>
            <td>{this.props.event.participant_count}</td>
            <td>
                <JoinDetailButtonComponent event={this.props.event}/>
            </td>
        </tr>)
    }

}
