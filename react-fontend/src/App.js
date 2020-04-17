import React, {Component, useEffect} from 'react';
import './App.css';
import BaseRouter from "./routes";
import {authCheckState, authLogout} from "./actions/authActions";
import AlertContainer from "./containers/AlertContainer";
import {connect} from "react-redux";
import {Router} from "react-router";
import {createBrowserHistory} from "history";

import NavBar from "./components/navbar/NavBar";
import theme from "./theme";
import {ThemeProvider} from "@material-ui/styles";

export const history = createBrowserHistory();


function App(props) {

    useEffect(() => {
        props.onTryAutoSignup()
    });

    return (
        <Router history={history}>
            <ThemeProvider theme={theme}>
                <NavBar/>
                <AlertContainer alerts={props.alerts}/>
                <BaseRouter/>
            </ThemeProvider>
        </Router>
    )
}

const mapStateToProps = state => {
    return {
        username: state.profile.user.username,
        alerts: state.alerts
    };
};

// authomatic auth check
const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(authCheckState()),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(App);