import React from 'react';
import List from "@material-ui/core/List";
import FeedbackItem from "./FeedbackItem";

/*
    Feedback items container. Nothing more than a list of feedbacks
 */
const FeedbacksComponent = ({feedbacks, edit}) => {
    const feedbackItems = feedbacks.map((feedback) => (
        <FeedbackItem
            key={feedback.id}
            feedback={feedback}
            edit={edit}
        />
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