import React from 'react';
import CustomAvatar from "./CustomAvatar";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Colors, List} from "react-native-paper";
import {useWindowDimensions, ToastAndroid, Alert} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {connect} from "react-redux"
import {OTHER_PROFILE_SCREEN, PROFILE_SCREEN, PROFILE_STACK} from "../constants/screens";
import axios from "axios"
import {profilesURL} from "../constants/apiurls";
import {headers} from "../utils/utils";


const ParticipantListItem = (props) => {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const navigation = props.navigation
    const {feedback, token} = props;

    return (
        <List.Item
            onPress={() => {
                if (feedback.comment.length > 80) {
                    Alert.alert(
                        "Comment",
                        feedback.comment,
                        [
                            {text: "Cancel", style: "cancel"},
                            {
                                text: "See Profile", onPress: () => {
                                    axios
                                        .get(profilesURL(feedback.giver.id),
                                            headers('application/json', token))
                                        .then(res => {
                                            navigation.navigate(OTHER_PROFILE_SCREEN, {
                                                id: feedback.giver.id,
                                                profile: res.data
                                            })
                                        })
                                        .catch(err => {
                                            ToastAndroid.show("An Error occured", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
                                            console.log(err)
                                        })

                                }
                            },
                            {text: "ok", style: "ok"}
                        ]
                    )
                } else {
                    axios
                        .get(profilesURL(feedback.giver.id),
                            headers('application/json', token))
                        .then(res => {
                            navigation.navigate(OTHER_PROFILE_SCREEN, {
                                id: feedback.giver.id,
                                profile: res.data
                            })
                        })
                        .catch(err => {
                            ToastAndroid.show("An Error occured", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
                            console.log(err)
                        })
                }

            }}
            key={feedback.id}
            title={`${feedback.giver.first_name} ${feedback.giver.last_name}`}
            titleStyle={{maxWidth: 100}}
            left={(props) => (
                <CustomAvatar
                    picture={feedback.giver.picture}
                    firstName={feedback.giver.first_name}
                    lastName={feedback.giver.last_name}
                    size={40}
                    // style={{marginTop: 5}}
                />)}
            description={feedback.comment}
            right={(props) => (
                <StarRating
                    halfStarEnabled
                    rating={feedback.vote}
                    starSize={20}
                    disabled={true}
                    fullStarColor={"#d6a000"}
                    containerStyle={{width: 90, marginLeft: 0, position: "absolute", right: 30, top: 7}}
                    emptyStarColor={"#808080"}
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