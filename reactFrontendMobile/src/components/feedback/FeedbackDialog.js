import {Button, Caption, Dialog, Paragraph, RadioButton, TextInput} from "react-native-paper";
import {ScrollView} from "react-native";
import StarRating from "react-native-star-rating";
import React from "react";
import {connect} from 'react-redux';
import {postCreateFeedback} from "../../utils/api";

/**
 * Dialog content consists of:
 * - Receiver choose with radio buttons
 * - Text input for feedback content
 * - Star rating
 */
const FeedbackDialogContent = (props) => (
    <Dialog.Content>
        <Paragraph style={{marginLeft: 15}}>We would love to know how your experience was!</Paragraph>
        <Caption style={{marginTop: 10}}>Choose the receiver:</Caption>
        <RadioButton.Group value={props.receiver} onValueChange={props.receiverChange}>
            <Dialog.ScrollArea>
                <ScrollView persistentScrollbar={true} style={{maxHeight: 80}}>
                    {props.feedbackMenuItems}
                </ScrollView>
            </Dialog.ScrollArea>
        </RadioButton.Group>
        <Caption style={{marginTop: 10}}>Leave your feedback!</Caption>
        <TextInput
            style={{maxHeight: 88}}
            label="Feedback"
            value={props.comment}
            onChangeText={props.commentChange}
            placeholder={"Write your Feedback here"}
            multiline={true}
            numberOfLines={2}
        />
        <Caption style={{marginTop: 10}}>Leave your rating!</Caption>
        <StarRating
            halfStarEnabled
            rating={props.vote}
            starSize={30}
            selectedStar={props.voteChange}
            fullStarColor={"#d6a000"}
            emptyStarColor={"#808080"}
        />
    </Dialog.Content>
)

/**
 * Two buttons:
 * - Cancel, to dismiss
 * - Submit, to execute the API call and dismiss
 */
const FeedbackDialogActions = (props) => (
    <Dialog.Actions>
        <Button onPress={props.onDismiss}>Close</Button>
        <Button onPress={() => {
            postCreateFeedback(props.event.id, props.receiver, props.comment, props.vote, props.token, (res) => {
                props.onDismiss()
            })
        }}>SUBMIT</Button>
    </Dialog.Actions>
)

/**
 * Feedback dialog to:
 * - chose the receiver,
 * - leave comment,
 * - give star rating.
 */
const FeedbackDialog = (props) => {
    const [comment, setComment] = React.useState("")
    const [vote, setVote] = React.useState(3)
    const [receiver, setReceiver] = React.useState(props.car[0].profile.id)

    return (
        <Dialog visible={props.visible} onDismiss={props.onDismiss}>
            <Dialog.Title>Submit Feedback</Dialog.Title>
            <FeedbackDialogContent {...props} comment={comment} vote={vote} receiver={receiver}
                                   commentChange={(comment) => setComment(comment)}
                                   voteChange={(vote) => setVote(vote)}
                                   receiverChange={(receiver) => setReceiver(receiver)}/>
            <FeedbackDialogActions {...props} receiver={receiver} vote={vote} comment={comment}/>

        </Dialog>)
}

function mapStateToProps(state) {
    return {
        token: state.auth.token
    };
}

export default connect(
    mapStateToProps,
)(FeedbackDialog);