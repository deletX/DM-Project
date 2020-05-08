import React from 'react';
import './App.css';
import BaseRouter from "./routes";
import {authCheckState} from "./actions/authActions";
import AlertContainer from "./containers/AlertContainer";
import {connect} from "react-redux";
import {Router} from "react-router";
import {createBrowserHistory} from "history";

import NavBar from "./components/navbar/NavBar";
import theme from "./theme";
import {ThemeProvider} from "@material-ui/core/styles";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export const history = createBrowserHistory();


function App(props) {

    if (!props.isAuthenticatedOrLoading && !props.error)
        props.onTryAutoSignup()

    return (
        <Router history={history}>

            <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <NavBar/>
                    <AlertContainer alerts={props.alerts}/>
                    <BaseRouter {...props}/>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </Router>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== undefined,
        isLoading: state.auth.loading,
        username: state.profile.user.username,
        alerts: state.alerts,
        profileId: state.profile.id,
        error: state.auth.error || state.profile.error || state.notifications.error,
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(authCheckState()),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(App);