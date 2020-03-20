import React from "react"
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {forEach} from "react-bootstrap/cjs/ElementChildren";
import {fetchEvents} from "../actions/eventActions";
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
import EventDetailContainer from "./EventDetailContainer";
import EventCreateComponent from "../components/EventCreateComponent";


export default class EventsContainer extends React.Component {
    render() {
        return (
            <div id="event-container">

                <Switch>
                    <Route exact path={"/"}>
                        <Redirect to={urls.events}/>
                    </Route>
                    <Route exact path={urls.events} component={EventsTableContainer}/>
                    <Route path={urls.join} component={EventJoinComponent}/>
                    <Route path={urls.detail} component={EventDetailContainer}/>
                    <Route path={urls.create} component={EventCreateComponent}/>
                </Switch>
            </div>
        );
    }
}

