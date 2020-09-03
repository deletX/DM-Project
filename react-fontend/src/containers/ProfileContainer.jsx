import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {handleError} from "../utils/utils";
import ProfileComponent from "../components/profile/ProfileComponent";
import {useParams} from "react-router";
import {useHistory} from "react-router-dom";
import {home, login} from "../constants/pagesurls";
import MyProfileComponent from "../components/profile/MyProfileComponent";
import OtherProfileComponent from "../components/profile/OtherProfileComponent";
import FormContainer from "./FormContainer";
import {Helmet} from "react-helmet";
import {getProfileData} from "../utils/api";
import {useSnackbar} from 'notistack';


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
    let history = useHistory()
    const {enqueueSnackbar,} = useSnackbar();

    let {id} = useParams()
    id = parseInt(id)

    const [profile, setProfile] = useState(profileId === id ? profileRedux : emptyProfile)
    const [loading, setLoading] = useState(false)

    const getProfile = () => {
        if (!loading) {
            setLoading(true)
            if (profileId !== id)
                getProfileData(id, token,
                    (res) => {
                        setProfile(res.data)
                        setLoading(false)
                    },
                    (err) => {
                        history.push(home)
                        setLoading(false)
                        handleError(enqueueSnackbar, "An error occurred while retrieving user profile", err)
                    })
            else {
                setProfile(profileRedux)
                setLoading(false)
            }
        }
    };

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

    return (
        <FormContainer effect={() => {
        }}>
            <Helmet>
                <title>DM Project - Profile Page</title>
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


export default connect(
    mapStateToProps,
)(ProfileContainer);


