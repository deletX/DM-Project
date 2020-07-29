import React from 'react';
import CustomAvatar from "../CustomAvatar";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Colors, List} from "react-native-paper";
import {useWindowDimensions, ToastAndroid} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {connect} from "react-redux"
import {OTHER_PROFILE_SCREEN, PROFILE_SCREEN, PROFILE_STACK} from "../../constants/screens";
import axios from "axios"
import {headers} from "../../utils";
import {profilesURL} from "../../constants/apiurls";


const ParticipantListItem = (props) => {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const navigation = props.navigation
    const {feedback, token} = props;
    return (
        <List.Item
            onPress={() => {
                if (feedback.profile.id === profileId) {
                    navigation.navigate(PROFILE_STACK)
                } else {
                    axios
                        .get(profilesURL(participant.profile.id),
                            headers('application/json', token))
                        .then(res => {
                            navigation.navigate(OTHER_PROFILE_SCREEN, {id: participant.profileId, profile: res.data})
                        })
                        .catch(err => {
                            ToastAndroid.show("An Error occured", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
                            console.log(err)
                        })
                }
            }}
            key={participant.id}
            title={`${participant.profile.first_name} ${participant.profile.last_name}`}
            titleStyle={{maxWidth: windowWidth - 230}}
            left={(props) => (
                <CustomAvatar
                    picture={participant.profile.picture}
                    firstName={participant.profile.first_name}
                    lastName={participant.profile.last_name}
                    size={40}
                />)}
            description={(props) => (

            )}
            right={(props) => (
                <StarRating
                    halfStarEnabled
                    rating={participant.profile.average_vote ? participant.profile.average_vote : 0}
                    starSize={20}
                    disabled={true}
                    fullStarColor={"#d6a000"}
                    containerStyle={{width: 100, marginLeft: 0, position: "absolute", right: 30}} ù
                    emptyStarColor={participant.profile.average_vote ? "#808080" : "#bbbbbb"}
                />)}

        />
    );
};


function mapStateToProps(state) {
    return {
        profileId: state.profile.id,
        token: state.auth.token,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}


export default connect(
    mapStateToProps,
)(ParticipantListItem);