import React from 'react';
import CustomAvatar from "../CustomAvatar";
import StarRating from "react-native-star-rating";
import {List} from "react-native-paper";
import {Alert, StyleSheet} from "react-native";
import {connect} from "react-redux"
import {getProfile} from "../../utils/api";
import {OTHER_PROFILE_SCREEN} from "../../constants/screens";


/**
 * Alert that contains the comment and three buttons to:
 * - close the alert
 * - see the giver profile
 * - close the alert
 */
const lengthyFeedbackAlert = (feedback, token, navigation) => {
    Alert.alert(
        "Comment",
        feedback.comment,
        [
            {text: "Cancel", style: "cancel"},
            {
                text: "See Profile", onPress: async () => {
                    await getProfile(feedback.giver.id, token, (res) => (navigation.navigate(OTHER_PROFILE_SCREEN, {
                        id: feedback.giver.id,
                        profile: res.data
                    })))

                }
            },
            {text: "ok", style: "ok"}
        ]
    )
}

/**
 * List item for feedback. Includes:
 * - User giver name
 * - User giver avatar
 * - feedback content
 * - star rating
 */
const FeedbackListComponent = (props) => {
    const navigation = props.navigation
    const {feedback, token} = props;

    return (
        <List.Item
            onPress={async () => {
                if (feedback.comment.length > 80) {
                    lengthyFeedbackAlert(feedback, token, navigation)
                } else {
                    await getProfile(feedback.giver.id, token, (res) => (navigation.navigate(OTHER_PROFILE_SCREEN, {
                        id: feedback.giver.id,
                        profile: res.data
                    })));
                }

            }}
            key={feedback.id}
            title={`${feedback.giver.first_name} ${feedback.giver.last_name}`}
            titleStyle={styles.titleStyle}
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
                    containerStyle={styles.containerStyle}
                    emptyStarColor={"#808080"}
                />)}

        />
    );
};

const styles = StyleSheet.create({
    titleStyle: {
        maxWidth: 100
    },
    containerStyle: {
        width: 90,
        marginLeft: 0,
        position: "absolute",
        right: 30,
        top: 7
    }
})

function mapStateToProps(state) {
    return {
        profileId: state.profile.id,
        token: state.auth.token,
    };
}

export default connect(
    mapStateToProps,
)(FeedbackListComponent);