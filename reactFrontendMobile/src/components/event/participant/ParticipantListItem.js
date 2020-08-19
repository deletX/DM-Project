import React from 'react';
import CustomAvatar from "../../CustomAvatar";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Colors, List} from "react-native-paper";
import {useWindowDimensions} from "react-native";
import {connect} from "react-redux"
import {OTHER_PROFILE_SCREEN, PROFILE_STACK} from "../../../constants/screens";
import {useNavigation} from "@react-navigation/native";
import {getProfile} from "../../../utils/api";


/**
 * A participant to an event gets rendered as a List.Item with title: his/her full name, his/her avatar
 * and his/her rating.
 * It is also shown an Icon to show their driver/passenger status if the prop rightIcon is true
 */
const ParticipantListItem = (props) => {
    const windowWidth = useWindowDimensions().width;
    const navigation = useNavigation()
    const {participant, profileId, token} = props;

    const rightIcon = props.rightIcon !== undefined ? props.rightIcon : true

    return (
        <List.Item
            onPress={async () => {
                if (participant.profile.id === profileId) {
                    navigation.navigate(PROFILE_STACK)
                } else {
                    await getProfile(participant.profile.id, token, (res) => {
                        navigation.navigate(OTHER_PROFILE_SCREEN, {id: participant.profileId, profile: res.data})
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
                <StarRating
                    halfStarEnabled
                    rating={participant.profile.average_vote ? participant.profile.average_vote : 0}
                    starSize={20}
                    disabled={true}
                    fullStarColor={"#d6a000"}
                    containerStyle={{width: 100, marginLeft: 0, position: "absolute", right: 30}}
                    emptyStarColor={participant.profile.average_vote ? "#808080" : "#bbbbbb"}
                />
            )}
            right={rightIcon ? (props) => (
                <Icon
                    style={{position: "absolute", top: 9, right: 0}}
                    name={participant.car === null ? "directions-walk" : "directions-car"}
                    color={participant.car === null ? Colors.orange700 : Colors.teal500}
                    size={20}
                />
            ) : undefined}

        />
    );
};


function mapStateToProps(state) {
    return {
        profileId: state.profile.id,
        token: state.auth.token,
    };
}


export default connect(
    mapStateToProps,
)(ParticipantListItem);