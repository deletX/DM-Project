import React from 'react'
import ReactDOM from 'react-dom'

import NavBarContainer from "./containers/NavBarContainer"
import TitleContainer from "./containers/TitleContainer"
import EventsContainer from "./containers/EventsContainer"
import {CLIENTID} from "./constants";
import GoogleLogin from "react-google-login";
import LoginButton from "./components/LoginLogoutButton"
import {BrowserRouter as Router} from "react-router-dom";
import store from './store';
import {Provider} from 'react-redux';

class App extends React.Component {
    render() {
        return <Provider store={store}>
            <Router>
                <NavBarContainer/>
                <TitleContainer/>
                <EventsContainer>Events</EventsContainer>
            </Router>
        </Provider>
    }
}


ReactDOM.render(<App/>, document.getElementById('app'));