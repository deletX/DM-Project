import {Text, Title} from "react-native-paper";
import {ScrollView, StyleSheet} from "react-native";
import * as React from "react";
import FeedbackListComponent from "../feedback/FeedbackListComponent";
import {useNavigation} from "@react-navigation/native";

/**
 * Received feedback container (with Title).
 * If there is no feedback, a text wil be displayed
 */
export const ProfileFeedbackReceived = (props) => {
    const navigation = useNavigation()
    let feedbackReceived = props.profile.receivedFeedback ? props.profile.receivedFeedback : props.profile.received_feedback;
    feedbackReceived = feedbackReceived.map((feedback) => (
        <FeedbackListComponent
            navigation={navigation}
            feedback={feedback}
            key={feedback.id}
        />
    ))
    return (
        <>
            <Title style={style.title}>
                Feedback received
            </Title>
            <ScrollView style={style.scrollView}>
                {feedbackReceived.length > 0 ? feedbackReceived :
                    <Text style={style.text}>No feedback here</Text>}
            </ScrollView>
        </>
    )
}

const style = StyleSheet.create({
    title: {
        marginTop: 10
    },
    scrollView: {
        maxHeight: 300
    },
    text: {
        marginLeft: "5%",
    }
})