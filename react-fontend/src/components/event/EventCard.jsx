import React, {useState} from 'react';
import {connect} from 'react-redux';
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import JoinContainer from "../../containers/JoinContainer";
import AlertDialog from "../AlertDialog";
import {handleError, handleSuccess} from "../../utils/utils";
import {useHistory} from "react-router-dom";
import {eventPage} from "../../constants/pagesurls";
import LinearProgress from "@material-ui/core/LinearProgress";
import {deleteEvent, leaveEvent} from "../../utils/api";
import {useSnackbar} from 'notistack';

/**
 * Event card to display an event. As a card has the event picture, the event name, date and location and several buttons:
 * to join/leave and to delete the event (if owner)
 */
const EventCard = (props) => {
    let history = useHistory()
    const classes = useStyles()
    const {enqueueSnackbar,} = useSnackbar();
    const {token, event, profileId, refreshEvents} = props;

    const [joinOpen, setJoinOpen] = useState(false);
    const [leaveOpen, setLeaveOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    let date = new Date(event.date_time)

    // user has joined the event
    let isInEvent = event.participant_set.filter(item => (item.profile.id === profileId)).length > 0;

    let isOwner = event.owner.id === profileId;

    return (
        <>
            <Card className={classes.root}>
                <CardActionArea
                    onClick={() => {
                        history.push(eventPage(event.id), event)
                    }}
                >
                    <CardMedia
                        className={classes.media}
                        image={event.picture}
                        title={event.name}
                    />
                    <LinearProgress color="secondary" hidden={event.status !== 1}/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" noWrap>
                            {event.name}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p" noWrap>
                            Date: {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" noWrap>
                            Location: {event.address}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {!isInEvent ?
                        <Button
                            className={classes.primaryButton}
                            disabled={event.status !== 0}
                            onClick={() => {
                                setJoinOpen(true)
                            }}>Join</Button>
                        :
                        <>
                            <Button
                                color="default"
                                className={classes.secondaryButton}
                                disabled={event.status !== 0}
                                onClick={() => {
                                    setLeaveOpen(true)
                                }}
                            >Leave</Button>
                        </>
                    }

                    {isOwner &&
                    <>
                        <Button
                            className={classes.delete}
                            disabled={event.status === 1}
                            onClick={() => {
                                setDeleteOpen(true)
                            }}>Delete</Button>
                    </>
                    }
                </CardActions>
            </Card>

            {/* Leave Alert Dialog */}
            <AlertDialog
                open={leaveOpen}
                handleClose={() => {
                    setLeaveOpen(false)
                }}
                title="Are you sure you want to leave?"
                contentText={`By clicking yes you will cancel your participation to "${event.name}". You will be able to re-join the event until the owner starts the computation!`}
                yesText="Yes"
                noText="No"
                onYes={() => {
                    let participation = event.participant_set.filter(item => (item.profile.id === profileId))[0];
                    leaveEvent(event.id, participation.id, token,
                        (res) => {
                            handleSuccess(enqueueSnackbar, "Successfully left the event")
                            refreshEvents()
                            setLeaveOpen(false)
                        },
                        (err) => {
                            handleError(enqueueSnackbar, "Something went wrong while leaving", err)
                            setLeaveOpen(false)
                        })
                }}
                onNo={() => {
                    setLeaveOpen(false)
                }}
            />

            {/* Delete Alert Dialog */}
            <AlertDialog
                open={deleteOpen}
                handleClose={() => {
                    setDeleteOpen(false)
                }}
                title="Are you sure you want to delete the event?"
                contentText={`You are going to delete the event "${event.name}". You will lose all the participations if you decide to recreate the event later. Proceed only if you are sure of what you're doing`}
                yesText="Yes"
                noText="No"
                onYes={() => {
                    deleteEvent(event.id, token,
                        (res) => {

                            refreshEvents()
                            setDeleteOpen(false)
                            handleSuccess(enqueueSnackbar, "Successfully deleted the event")
                        },
                        (err) => {

                            setDeleteOpen(false)
                            handleError(enqueueSnackbar, "Something went wrong while deleting event [035]", err)
                        })
                }}
                onNo={() => {
                    setDeleteOpen(false)
                }}
            />

            <JoinContainer
                open={joinOpen}
                close={() => {
                    setJoinOpen(false)
                }}
                event={event}
                refreshEvents={refreshEvents}/>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 300,
        maxHeight: 310,
        width: '50vw',
        minWidth: 250,
    },
    media: {
        height: 140,
    },
    primaryButton: {
        color: theme.palette.primary.dark,
    },
    secondaryButton: {
        color: theme.palette.secondary.dark,
    },
    delete: {
        color: "darkred",
    },
}));


function mapStateToProps(state) {
    return {
        token: state.auth.token,
        profileId: state.profile.id
    };
}


export default connect(
    mapStateToProps,
)(EventCard);
