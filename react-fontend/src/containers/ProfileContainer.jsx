import React, {Component, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {profilesURL} from "../constants/apiurls";
import {headers, isAuthenticated} from "../utils";
import axios from "axios"
import {addAlert} from "../actions/alertActions";
import ProfileComponent from "../components/profile/ProfileComponent";
import {useParams} from "react-router";
import {useHistory} from "react-router-dom";
import {home, login} from "../constants/pagesurls";
import MyProfileComponent from "../components/profile/MyProfileComponent";
import OtherProfileComponent from "../components/profile/OtherProfileComponent";
import FormContainer from "./FormContainer";
import {Helmet} from "react-helmet";

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        isAuthenticated: state.auth.token !== undefined,
        isLoading: state.auth.loading,
        profileId: state.profile.id,
        profileRedux: {
            average_vote: state.profile.averageVote,
            car_set: state.profile.carSet,
            id: state.profile.id,
            picture: state.profile.picture,
            received_feedback: state.profile.receivedFeedback,
            score: state.profile.score,
            user: state.profile.user,
            given_feedback: state.profile.givenFeedback,
        }
    };
}


function mapDispatchToProps(dispatch) {
    return {
        addAlert: (text, style) => dispatch(addAlert(text, style))
    };
}

const emptyProfile = {
    average_vote: null,
    car_set: [],
    id: -1,
    picture: null,
    received_feedback: [],
    score: 0,
    user: {
        id: -1,
        email: "",
        first_name: "",
        last_name: "",
        username: "",
    }

}

const ProfileContainer = ({location, addAlert, token, isAuthenticated, isLoading, profileId, profileRedux}) => {
    let history=useHistory()
    let {id} = useParams()
    id = parseInt(id)

    const [profile, setProfile] = useState(profileId === id ? profileRedux : emptyProfile)
    const [loading, setLoading] = useState(false)

    useEffect(() => {

            if (!(isAuthenticated || isLoading))
                history.push(`${login}?next=${encodeURI(location.pathname)}`)
            else if (profile.id === -1 && isAuthenticated) {
                if (profileId === id) {
                    setProfile(profileRedux)
                } else {
                    getProfile()
                }
            }
            if (profileId === id && !("givenFeedback" in profile)) {
                setProfile(profileRedux)
            }
        }, [isAuthenticated, isLoading, profile, profileId, profileRedux, id]
    )

    const getProfile = () => {
        if (!loading) {
            setLoading(true)
            if (profileId !== id)
                axios
                    .get(profilesURL(id),
                        headers('application/json', token))
                    .then(res => {
                        setProfile(res.data)
                        setLoading(false)
                    })
                    .catch(err => {
                        console.log(err)
                        addAlert("An error occurred while retrieving the profile", "error")
                        history.push(home)
                        setLoading(false)
                    })
            else {
                setProfile(profileRedux)
                setLoading(false)
            }
        }
    };
    return (
        <FormContainer effect={() => {
        }}>
            <Helmet>
                <title>React App - Profile Page</title>
            </Helmet>
            {("given_feedback" in profile) ?
                <MyProfileComponent profile={profile}/>
                :
                <>
                    <ProfileComponent profile={profile}/>
                    <OtherProfileComponent profile={profile}/>
                </>
            }
        </FormContainer>
    );
}


export default connect(
    mapStateToProps, mapDispatchToProps
)(ProfileContainer);


