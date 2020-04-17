import React from "react";
import {Route, Switch} from "react-router-dom";

// import requireAuth from "./requireAuth"; // deprecated

import {createBrowserHistory} from "history";
import AuthContainer from "./containers/AuthContainer";
import SignupComponent from "./components/auth/SignupComponent";
import LoginComponent from "./components/auth/LoginComponent";
import HomeContainer from "./containers/HomeContainer";
import MapContainer from "./containers/Map";

const history = createBrowserHistory();


const BaseRouter = props => (
    <div>
        <Switch>
            {/*<Route exact path="/">*/}
            {/*    <LandingPageContainer/>*/}
            {/*</Route>*/}
            <Route exact path="/login">
                <AuthContainer>
                    <LoginComponent/>
                </AuthContainer>
            </Route>
            <Route exact path="/signup">
                <AuthContainer>
                    <SignupComponent/>
                </AuthContainer>
            </Route>
            <Route exact path="/home" component={HomeContainer}/>
            {/*<Route exact path="/profile/:id" component={ProfileContainer}/>*/}
            {/*<Route exact path="/my-profile" component={MyProfileContainer}/>*/}
            {/*<Route exact path="/events/:id" component={EventContainer}/>*/}
            <Route path="*" component={MapContainer}/>
        </Switch>
    </div>
);

export default BaseRouter;