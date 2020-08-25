import React from "react";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import FormContainer from "./containers/FormContainer";
import SignupComponent from "./components/auth/SignupComponent";
import LoginComponent from "./components/auth/LoginComponent";
import HomeContainer from "./containers/HomeContainer";
import CreateComponent from "./components/event/CreateComponent";
import {addEvent, home, login, profile, profile_id, signup} from "./constants/pagesurls";
import EventContainer from "./containers/EventContainer";
import ProfileContainer from "./containers/ProfileContainer";
import LandingPageContainer from "./containers/LandingPageContainer";
import NotFound404 from "./components/NotFound404";
import {useQuery} from "./utils/utils";


const Login = (props) => {
    let history=useHistory()
    const query = useQuery()
    return (<FormContainer effect={() => {
        if (props.isAuthenticated)
            history.push(query.get("next") != null ? decodeURI(query.get("next")) : home)
    }}>
        <LoginComponent/>
    </FormContainer>)
}

const Signup = props => {
    let history=useHistory()
    const query = useQuery()
    return (
        <FormContainer effect={() => {
            if (props.isAuthenticated)
                history.push(query.get("next") != null ? decodeURI(query.get("next")) : home)
        }}>
            <SignupComponent/>
        </FormContainer>
    )
}

const BaseRouter = props => (
    <div>
        <Switch>

            <Route exact path="/">
                <LandingPageContainer/>
            </Route>
            <Route exact path={login}>
                <Login {...props}/>
            </Route>
            <Route exact path={signup}>
                <Signup {...props}/>
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