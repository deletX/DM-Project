import {Text, Title} from "react-native-paper";
import {ScrollView} from "react-native";
import * as React from "react";
import FeedbackListComponent from "../feedback/FeedbackListComponent";
import {useNavigation} from "@react-navigation/native";

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
    return (<>
        <Title style={{marginTop: 10}}>
            Feedback received
        </Title>
        <ScrollView style={{maxHeight: 300}}>
            {feedbackReceived.length > 0 ? feedbackReceived : <Text style={{marginLeft: "5%"}}>No feedback here</Text>}
        </ScrollView>
    </>)
}