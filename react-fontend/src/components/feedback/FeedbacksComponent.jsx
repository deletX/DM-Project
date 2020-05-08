import React from 'react';
import List from "@material-ui/core/List";
import FeedbackItem from "./FeedbackItem";
import Typography from "@material-ui/core/Typography";

const FeedbacksComponent = ({feedbacks, edit}) => {
    const feedbackItems = feedbacks.map((feedback) => (
        <FeedbackItem key={feedback.id} feedback={feedback} edit={edit}/>
    ))

    return (
        <>
            <List>
                {feedbackItems}
            </List>
        </>
    )

};

export default FeedbacksComponent;