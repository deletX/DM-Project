import React from 'react'
import ReactDOM from 'react-dom'

import NavBarContainer from "./containers/NavBarContainer"
import TitleContainer from "./containers/TitleContainer"
import EventsContainer from "./containers/EventsContainer"
import {CLIENTID} from "./constants";
import GoogleLogin from "react-google-login";
import LoginButton from "./components/LoginLogoutButton"

import store from './store';
import {Provider} from 'react-redux';

class App extends React.Component {
    render() {
        return <Provider store={store}>
            <NavBarContainer>NavBar</NavBarContainer>
            <TitleContainer> Welcome</TitleContainer>
            <EventsContainer>Events</EventsContainer>
        </Provider>
    }
}


ReactDOM.render(<App/>, document.getElementById('app'));