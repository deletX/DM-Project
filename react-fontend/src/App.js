import React from 'react';
import './App.css';
import BaseRouter from "./routes";
import {authCheckState} from "./actions/authActions";
import {connect} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {createBrowserHistory} from "history";

import NavBar from "./components/navbar/NavBar";
import theme from "./utils/theme";
import {ThemeProvider} from "@material-ui/core/styles";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {SnackbarProvider} from 'notistack';
import TryAutoSignup from "./components/TryAutoSignup";

export const history = createBrowserHistory();


function App(props) {

    return (
        <BrowserRouter history={history}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <TryAutoSignup {...props}/>
                        <NavBar/>
                        <BaseRouter {...props}/>

                    </MuiPickersUtilsProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== undefined,
        isLoading: state.auth.loading,
        username: state.profile.user.username,
        profileId: state.profile.id,
        error: state.auth.error || state.profile.error || state.notifications.error,
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: (enqueueSnackbar) => dispatch(authCheckState(enqueueSnackbar)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(App);