import React, {useState} from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AvatarCustom from "../AvatarCustom";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {handleError, handleSuccess} from "../../utils/utils";
import {connect} from "react-redux"
import {putEditFeedback} from "../../utils/api";
import {useSnackbar} from 'notistack';

const useStyles = makeStyles((theme) => ({
    textContainer: {
        position: "relative",
        width: "100%",
    },
    rating: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    name: {},
    comment: {
        overflowY: "auto",
        maxHeight: "200px",
    }
}));

const FeedbackItem = ({token, addAlert, feedback, edit = false}) => {
    const [feedbackOpen, setFeedbackOpen] = useState(false)
    const [feedbackState, setFeedback] = useState(feedback)
    const [vote, setVote] = useState(feedback.vote)
    const [comment, setComment] = useState(feedback.comment)
    const {enqueueSnackbar,} = useSnackbar();
    const classes = useStyles();
    return (
        <ListItem>
            <ListItemAvatar>
                <AvatarCustom firstName={!edit ? feedback.giver.first_name : feedback.receiver.first_name}
                              lastName={!edit ? feedback.giver.last_name : feedback.receiver.last_name}
                              src={!edit ? feedback.giver.picture : feedback.receiver.picture}/>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <div className={classes.textContainer}>
                        <Typography className={classes.name}>
                            {!edit ? `${feedback.giver.first_name} ${feedback.giver.last_name}` : `${feedback.receiver.first_name} ${feedback.receiver.last_name}`}
                        </Typography>
                    </div>
                }
                secondary={
                    <Typography className={classes.comment}>
                        {feedbackState.comment}
                    </Typography>
                }
            />
            <div className={classes.rating}>
                <Rating name={`${feedback.giver.id}-rating-${feedback.event.id}`} precision={.5}
                        value={feedbackState.vote}
                        readOnly size="small"
                />
                {edit &&
                <Button size="small" color="primary"
                        onClick={() => {
                            setFeedbackOpen(true)
                        }}>
                    edit
                </Button>
                }
            </div>
            <Dialog open={feedbackOpen} onClose={() => {
                setFeedbackOpen(false)
            }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Submit Feedback</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can change your comment and vote here.
                    </DialogContentText>
                    <div className={classes.feedbackForm}>
                        <Rating
                            name="rating"
                            value={vote}
                            precision={0.5}
                            onChange={(event, newValue) => {
                                setVote(newValue);
                            }}
                        />
                        <TextField
                            value={comment}
                            onChange={(input) => {
                                setComment(input.target.value)
                            }}
                            margin="dense"
                            id="comment"
                            label="Feedback"
                            fullWidth
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setFeedbackOpen(false)
                    }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        putEditFeedback(feedback.event.id, feedback.receiver.id,
                            feedback.id, comment, vote, token,
                            (res) => {
                                setFeedbackOpen(false)
                                setFeedback(res.data)
                                handleSuccess(enqueueSnackbar, "Successfully edited your feedback")
                            },
                            (err) => {
                                setFeedbackOpen(false)
                                handleError(enqueueSnackbar, "An error occured while editing your feedback", err)
                            })
                    }} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </ListItem>
    )
};

function mapStateToProps(state) {
    return {
        token: state.auth.token
    };
}


export default connect(
    mapStateToProps,
)(FeedbackItem);
