import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {createBrowserHistory} from "history";
import FormContainer from "./containers/FormContainer";
import SignupComponent from "./components/auth/SignupComponent";
import LoginComponent from "./components/auth/LoginComponent";
import HomeContainer from "./containers/HomeContainer";
import MapContainer from "./containers/MapContainer";
import JoinContainer from "./containers/JoinContainer";
import CreateComponent from "./components/event/CreateComponent";
import {addEvent, createEvent, home, login, profile, profile_id, signup} from "./constants/pagesurls";
import {history} from "./App";
import {useLocation} from "react-router";
import EventContainer from "./containers/EventContainer";
import ProfileContainer from "./containers/ProfileContainer";
import LandingPageContainer from "./containers/LandingPageContainer";
import NotFound404 from "./components/NotFound404";


const BaseRouter = props => (
    <div>
        <Switch>

            <Route exact path="/">
                <LandingPageContainer/>
            </Route>
            <Route exact path={login}>
                <FormContainer effect={() => {
                    if (props.isAuthenticated)
                        history.push(home)
                }}>
                    <LoginComponent/>
                </FormContainer>
            </Route>
            <Route exact path={signup}>
                <FormContainer effect={() => {
                    if (props.isAuthenticated)
                        history.push(home)
                }}>
                    <SignupComponent/>
                </FormContainer>
            </Route>
            <Route exact path={home} component={HomeContainer}/>
            <Route exact path={addEvent} component={CreateComponent}/>
            <Route exact path={profile_id} component={ProfileContainer}/>
            <Route exact path="/my-profile" render={() => (<Redirect to={profile(props.profileId)}/>)}/>
            <Route exact path="/events/:id" component={EventContainer}/>
            <Route exact path={"*"} component={NotFound404}/>
        </Switch>
    </div>
);

export default BaseRouter;