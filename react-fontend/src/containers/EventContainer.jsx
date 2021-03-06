import React, {useEffect, useState} from 'react';
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {white} from "color-name";
import red from '@material-ui/core/colors/red';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Divider from "@material-ui/core/Divider";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import Alert from "@material-ui/lab/Alert";
import {useParams} from "react-router";
import {useHistory} from "react-router-dom";
import {eventPage, home, login} from "../constants/pagesurls";
import AlertDialog from "../components/misc/AlertDialog";
import {
    dateFormatter,
    handleError,
    handleInfo,
    handleSuccess,
    handleWarning,
    isDateBefore,
    pridStringToLatLng
} from "../utils/utils";
import JoinContainer from "./JoinContainer";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import {KeyboardDatePicker, KeyboardTimePicker} from "@material-ui/pickers";
import {white_text_theme} from "../utils/theme";
import {PhotoCamera} from "@material-ui/icons";
import MapContainer from "./MapContainer";
import ParticipantsContainer from "./ParticipantsContainer";
import Fab from "@material-ui/core/Fab";
import Computing from "../components/participations/Computing";
import OtherCarsParticipation from "../components/participations/OtherCarsParticipation";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Rating from "@material-ui/lab/Rating";
import {Helmet} from "react-helmet";
import {deleteEvent, getEventAxios, leaveEvent, postCreateFeedback, runEvent, updateEvent} from "../utils/api";
import {useSnackbar} from 'notistack';
import _ from "lodash";

/**
 * Empty Event
 * @type {{date: string, owner: {profile: {id: number}}, address: string, name: string, destination: string, description: string, participant_set: [], picture: string}}
 */
const emptyEvent = {
    name: "",
    description: "",
    destination: "SRID=4326;POINT (44.629430 10.948296)`",
    address: "",
    date: (new Date()).toString(),
    picture: "",
    owner: {
        profile: {
            id: -1
        }
    },
    participant_set: []
}

/**
 * Event Container that contains element to show an event (in every status) and also enable the owner to change any data
 */
const EventContainer = (props) => {
        let history = useHistory();
        const classes = useStyles();
        const {enqueueSnackbar,} = useSnackbar();
        let {id} = useParams();
        const {location, token, profileId, isAuthenticated, isAuthLoading} = props;

        // Dialogs
        const [deleteOpen, setDeleteOpen] = useState(false)
        const [joinOpen, setJoinOpen] = useState(false)
        const [leaveOpen, setLeaveOpen] = useState(false)
        const [feedbackOpen, setFeedbackOpen] = useState(false)

        // Loading
        const [isLoading, setIsLoading] = useState(false)

        // Enable edit flag
        const [edit, setEdit] = useState(false)

        // Event data
        const [event, setEvent] = useState(location.state ? location.state : emptyEvent)
        let date = new Date(event.date_time)

        const [day, setDay] = useState(date)
        const [time, setTime] = useState(date)
        const [image, setImage] = useState(null)
        const [imageURL, setImageURL] = useState(event.picture)
        const [name, setName] = useState(event.name)
        const [description, setDescription] = useState(event.description)
        const [address, setAddress] = useState(event.address)
        const [destination, setDestination] = useState(event.destination)

        // Feedback content
        const [comment, setComment] = useState("")
        const [vote, setVote] = useState(3)
        const [receiver, setReceiver] = useState(-1)

        const latitude = parseFloat(event.destination.split(' ')[1].slice(1));
        const longitude = parseFloat(event.destination.split(' ')[2].slice(0, -1));

        const isOwner = profileId === event.owner.id;

        const isRunning = event.status === 1;
        const isCompleted = event.status === 2;

        // participation variables
        const participation = event.participant_set.filter(participation => (participation.profile.id === profileId))
        const expense = participation.length > 0 ? participation[0].expense : 0
        const drivers = event.participant_set.filter(part => (part.car !== null))

        // now is one hour ahead actually
        let now = new Date()
        now = new Date(now.getTime() + 3600 * 1000)

        let date_tmp = day !== null && time !== null ? new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.getHours(), time.getMinutes()) : new Date()
        const valid = name.length > 0 && date_tmp > now && description.length > 0 && address !== "" && destination !== "";

        // user's car if any
        const myCar = (participation.length > 0 && participation[0].car !== null) ? _.sortBy(event.participant_set.filter((item) => (item.car !== null && item.car.id === participation[0].car.id)), ['pickup_index']) : []

        let directionsURL = ""
        if (participation.length > 0 && participation[0].pickup_index === 0)
            directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${pridStringToLatLng(event.destination).join(",")}&travelmode=driving&waypoints=${myCar.filter(item => (item.id !== participation[0].id)).map(item => pridStringToLatLng(item.starting_pos).join(",")).join("%7C")}`

        const feedbackMenuItems =
            myCar.length === 0 ? [] :
                myCar.map(item => (
                    <MenuItem
                        value={item.profile.id}>
                        {item.profile.first_name}
                        {item.profile.last_name}
                    </MenuItem>))

        let expired = isDateBefore(date, new Date())
        // if not authenticated go to login and then here. Otherwise if event is empty get it from API
        useEffect(() => {
                if (!(isAuthenticated || isAuthLoading))
                    history.push(`${login}?next=${encodeURI(eventPage(id))}`)
                else if (event.name === "" && isAuthenticated) {
                    getEvent()
                } // eslint-disable-next-line
            }, [event, isAuthenticated, isAuthLoading]
        )

        /**
         * API call to send feedback
         */
        const sendFeedback = () => {
            postCreateFeedback(event.id, receiver, comment, vote, token,
                (res) => {
                    setFeedbackOpen(false)
                    getEvent()
                    handleSuccess(enqueueSnackbar, "Feedback left with success!")
                },
                (err) => {
                    setFeedbackOpen(false)
                    handleError(enqueueSnackbar, "Something went wrong while posting your feedback [038]", err)
                })
        };

        /**
         * API call to start computation
         */
        const run = () => {
            runEvent(id, token,
                (res) => {
                    setEvent({...event, status: 1})
                    handleInfo(enqueueSnackbar, "Computation has started")
                },
                (err) => {
                    handleError(enqueueSnackbar, "Something went wrong while launching the computation [039]", err)
                }
            )
        }

        /**
         * API call to retrieve the event
         */
        const getEvent = () => {
            getEventAxios(id, token,
                (res) => {
                    setEvent(res.data)
                    setImageURL(res.data.picture)
                    setName(res.data.name)
                    setDescription(res.data.description)
                    setAddress(res.data.address)
                    setDestination(res.data.destination)
                    setDay(new Date(res.data.date_time))
                    setTime(new Date(res.data.date_time))
                },
                (err) => {
                    handleError(enqueueSnackbar, "Something went wrong while retrieving event data [040]", err)
                }
            )
        }

        /**
         * API call to update event data
         */
        const update = () => {
            let data;
            setIsLoading(true)
            if (image === null) {
                data = {
                    name: name,
                    description: description,
                    address: address,
                    destination: destination,
                    date_time: `${day.getUTCFullYear()}-${day.getUTCMonth() < 10 ? '0' : ''}${day.getUTCMonth() + 1}-${day.getUTCDate()} ${time.getUTCHours()}:${time.getUTCMinutes()}`,
                }
            } else {
                data = new FormData();
                data.append("picture", image, image.name);//, image.name
                data.append("name", name);
                data.append("description", description)
                data.append("address", address)
                data.append("destination", destination)
                data.append("date_time",
                    `${day.getUTCFullYear()}-${day.getUTCMonth() < 10 ? '0' :
                        ''}${day.getUTCMonth() + 1}-${day.getUTCDate()} ${time.getUTCHours()}:${time.getUTCMinutes()}`)
            }

            updateEvent(id, data, token,
                image,
                (res) => {
                    setEvent(res.data)
                    setImageURL(res.data.picture)
                    setName(res.data.name)
                    setDescription(res.data.description)
                    setAddress(res.data.address)
                    setDestination(res.data.destination)
                    setDay(new Date(res.data.date_time))
                    setTime(new Date(res.data.date_time))
                    setIsLoading(false)
                    setEdit(false)
                    handleSuccess(enqueueSnackbar, "Event successfully updated!")
                },
                (err) => {
                    handleError(enqueueSnackbar, "Something went wrong while updating event [041]", err)
                }
            )
        }

        return (
            <>
                <Helmet>
                    <title>DM Project - {event.name}</title>
                    <meta name="description" content={event.description}/>
                </Helmet>
                <div className={classes.root}>
                    <div className={classes.header}
                         style={{backgroundImage: `url(${imageURL})`}}>
                        <div className={classes.scrim}>

                            {/* An additional theme provider to have white text */}
                            <ThemeProvider theme={white_text_theme}>
                                <Grid container spacing={2} className={classes.headerGrid}>
                                    <Grid item xs={12} md={8}>

                                        {/* Event name */}
                                        {!edit ?
                                            <Typography variant="h2" component="h2" className={classes.mainTitle}>
                                                {event.name}
                                            </Typography>
                                            :
                                            <TextField
                                                label="Name"
                                                color="secondary"
                                                fullWidth
                                                multiline
                                                rowsMax={3}
                                                value={name}
                                                onChange={(input) => {
                                                    setName(input.target.value)
                                                }}
                                                error={name.length <= 0}
                                                className={classes.headerTextField}
                                                InputProps={{
                                                    classes: {
                                                        input: classes.headerTextFieldInput,
                                                    }
                                                }}
                                                required
                                                helperText={name.length <= 0 ? "Required" : ""}
                                            />
                                        }

                                    </Grid>

                                    <Grid item xs={false} md={2}/>
                                    <Grid item xs={12} md={6}>

                                        {/* Event date */}
                                        {!edit ?
                                            <Typography variant="h5">
                                                Date: {dateFormatter(date)}
                                            </Typography>
                                            :
                                            <>
                                                <KeyboardDatePicker
                                                    color="secondary"
                                                    label="Date"
                                                    value={day}
                                                    placeholder="26/03/2020"
                                                    onChange={date => {
                                                        setDay(date)
                                                    }}
                                                    minDate={new Date()}
                                                    format="dd/MM/yyyy"
                                                />
                                                <KeyboardTimePicker
                                                    color="secondary"
                                                    label="Time"
                                                    value={time}
                                                    placeholder="21:30"
                                                    ampm={false}
                                                    onChange={date => {
                                                        setTime(date)
                                                    }}
                                                    mask="__:__"
                                                />
                                            </>
                                        }
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        {!edit &&
                                        <Typography variant="h5">
                                            Destination: {event.address}
                                        </Typography>
                                        }
                                    </Grid>
                                </Grid>
                            </ThemeProvider>

                            <div className={classes.buttons}>
                                {isOwner &&
                                <Button
                                    variant="contained"
                                    className={classes.runButton}
                                    color="primary"
                                    disabled={(isRunning || isCompleted) || edit || expired}
                                    onClick={() => {
                                        let availableSeats = drivers.map(
                                            item => item.car.tot_avail_seats
                                        ).reduce((prev, curr) => (prev + curr), 0);
                                        if (availableSeats < event.participant_set.length || event.participant_set.length === 0) {
                                            handleWarning(enqueueSnackbar, "Oh no! It seems there aren't enough cars to bring all these people!")
                                        } else {
                                            run()
                                        }
                                    }}
                                >
                                    Run
                                </Button>
                                }

                                <ButtonGroup
                                    variant="contained"
                                    color={isOwner ? (participation.length !== 0 ? "secondary" : "primary") : "primary"}>
                                    {participation.length !== 0 ?
                                        <Button
                                            color="secondary"
                                            disabled={(isRunning || isCompleted) || edit || expired}
                                            onClick={() => {
                                                setLeaveOpen(true)
                                            }}
                                        >
                                            Leave
                                        </Button>

                                        :

                                        <Button
                                            color="primary"
                                            disabled={isRunning || isCompleted || edit || expired}
                                            onClick={() => {
                                                setJoinOpen(true)
                                            }}
                                        >
                                            Join
                                        </Button>
                                    }
                                    <Button
                                        color="secondary"
                                        disabled={!edit ? !(isOwner && !(isRunning || isCompleted || expired)) : !valid}
                                        onClick={() => {
                                            if (edit) {
                                                update()
                                            } else
                                                setEdit(true)
                                        }}
                                    >
                                        {edit ? "Save" : "Edit"}
                                    </Button>

                                    <Button className={classes.deleteButton}
                                            disabled={!(isOwner && !(isRunning))}
                                            onClick={() => {
                                                if (edit) {
                                                    setImageURL(event.picture)
                                                    setEdit(false)
                                                } else
                                                    setDeleteOpen(true)
                                            }}
                                    >
                                        {edit ? "Cancel" : "Delete"}
                                    </Button>
                                </ButtonGroup>

                                {edit &&
                                <>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        style={{display: 'none'}}
                                        id="raised-button-file"
                                        multiple
                                        type="file"
                                        onChange={(input) => {
                                            let fileReader = new FileReader();
                                            let file = input.target.files[0];
                                            fileReader.onloadend = () => {
                                                setImageURL(fileReader.result)
                                            }
                                            setImage(file)
                                            fileReader.readAsDataURL(file)
                                        }}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Fab
                                            color="secondary"
                                            aria-label="upload picture"
                                            size="small"
                                            component="span"
                                            className={classes.changePictureButton}>
                                            <PhotoCamera/>
                                        </Fab>
                                    </label>
                                </>
                                }
                            </div>
                        </div>
                    </div>

                    {(isRunning || isLoading) &&
                    <LinearProgress color="secondary" className={classes.loadingBar}/>
                    }
                    {isRunning &&
                    <Alert severity="info" className={classes.warning}>
                        Thinking about the best routes. This may take a while. Come back later!
                    </Alert>
                    }
                    {isCompleted &&
                    <Alert severity="success" className={classes.warning}>
                        Beep beep boop, computation completed!
                    </Alert>
                    }
                    {(!isCompleted && !isRunning && expired) &&
                    <Alert severity="warning" className={classes.warning}>
                        Seems like this event has passed without being computed :(
                    </Alert>
                    }

                    <div className={classes.body}>
                        <div className={classes.element}>
                            <Typography variant="h4">
                                Description
                            </Typography>
                            {!edit ?
                                <Typography component="div">
                                    {   // This is done to improve visualization
                                        event.description.split("\n").map(
                                            (i, key) => {
                                                return (
                                                    <p key={key}>
                                                        {i}
                                                    </p>
                                                )
                                            })}
                                </Typography>
                                :
                                <TextField
                                    color="secondary"
                                    fullWidth
                                    multiline
                                    rowsMax={6}
                                    value={description}
                                    onChange={(input) => {
                                        setDescription(input.target.value)
                                    }}
                                    error={description.length <= 0}
                                    required
                                    helperText={description.length <= 0 ? "Required" : ""}/>
                            }
                        </div>

                        <Divider className={classes.divider}/>
                        <div className={classes.element}>
                            <Typography variant="h4">
                                Destination
                            </Typography>
                            {!edit ?
                                <Box className={classes.mapBox}>
                                    <Map
                                        center={[latitude, longitude]}
                                        zoom={13}
                                        className={classes.map}
                                    >
                                        <TileLayer
                                            attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker
                                            position={{lat: latitude, lng: longitude}}
                                        >
                                            <Popup>
                                                {event.address}
                                            </Popup>
                                        </Marker>
                                    </Map>
                                </Box>
                                :
                                <MapContainer
                                    className={classes.mapContainer}
                                    addr={address} pos={destination}
                                    setAddr={setAddress}
                                    setPos={setDestination}/>
                            }
                        </div>

                        {!edit &&
                        <>
                            <Divider className={classes.divider}/>
                            {!(isRunning || isCompleted) &&
                            <div className={`${classes.element} ${classes.participants}`}>
                                <Typography variant="h4">
                                    Participants
                                </Typography>
                                <div className={classes.participantsContainer}>

                                    {event.participant_set.length === 0 ?
                                        <Typography>
                                            Seems there's no one here... yet ;)
                                        </Typography>
                                        :
                                        <ParticipantsContainer
                                            participantSet={event.participant_set} profileId={profileId}/>
                                    }
                                </div>
                            </div>
                            }
                        </>
                        }

                        {isCompleted &&
                        <>
                            {participation.length !== 0 &&
                            <div className={`${classes.element} ${classes.participants}`}>
                                <Typography variant="h4">
                                    Your Car
                                </Typography>
                                <Typography>
                                    Expenses: {expense}€
                                </Typography>
                                {participation[0].pickup_index === 0 &&
                                <Button color="primary"
                                        variant="outlined"
                                        target="_blank"
                                        href={directionsURL}>
                                    Directions
                                </Button>
                                }
                                <div className={classes.participantsContainer}>
                                    <ParticipantsContainer
                                        participantSet={myCar}
                                        profileId={profileId}
                                        onlyDriverIcon={true}/>
                                    <Button color="primary"
                                            disabled={(new Date()) < date}
                                            onClick={() => {
                                                setReceiver(myCar[0].profile.id)
                                                setFeedbackOpen(true)
                                            }}>
                                        Submit Feedback
                                    </Button>
                                </div>
                            </div>
                            }

                            {isOwner &&
                            <>
                                {participation.length !== 0 &&
                                <Divider className={classes.divider}/>
                                }
                                <div className={classes.element}>
                                    <Typography variant="h4">
                                        Other Cars
                                    </Typography>
                                    <div className={classes.participantsContainer}>
                                        <OtherCarsParticipation
                                            participantSet={event.participant_set}
                                            profileId={profileId}/>
                                    </div>
                                </div>
                            </>
                            }
                        </>

                        }
                        {isRunning &&
                        <div className={classes.element}>
                            <Computing/>
                        </div>
                        }
                    </div>

                    {/* Feedback Dialog*/}
                    <Dialog
                        open={feedbackOpen}
                        onClose={() => {
                            setFeedbackOpen(false)
                        }} aria-labelledby="form-dialog-title">
                        <DialogTitle
                            id="form-dialog-title">
                            Submit Feedback
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                We would love to know how your experience was!
                            </DialogContentText>
                            <div className={classes.feedbackForm}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel
                                        id="select-receiver-label">
                                        Receiver
                                    </InputLabel>
                                    <Select
                                        labelId="select-receiver-label"
                                        id="select-receiver"
                                        value={receiver}
                                        onChange={(value) => {
                                            setReceiver(value.target.value)
                                        }}
                                    >
                                        {feedbackMenuItems}
                                    </Select>
                                </FormControl>
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
                            <Button
                                onClick={() => {
                                    setFeedbackOpen(false)
                                }}
                                color="primary">
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setFeedbackOpen(true)
                                    sendFeedback()
                                }}
                                color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Leave Dialog */}
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
                                    setLeaveOpen(false)
                                    history.push(home)
                                    handleSuccess(enqueueSnackbar, "Successfully left the event")
                                },
                                (err) => {
                                    setLeaveOpen(false)
                                    handleError(enqueueSnackbar, "Something went wrong while leaving [037]", err)
                                })
                        }}
                        onNo={() => {
                            setLeaveOpen(false)
                        }}
                    />

                    {/* Delete Dialog */}
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
                                    setDeleteOpen(false)
                                    history.push(home)
                                    handleSuccess(enqueueSnackbar, "Successfully deleted the event")
                                },
                                (err) => {
                                    setDeleteOpen(false)
                                    handleError(enqueueSnackbar, "Something went wrong while deleting your event [035]", err)
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
                        refreshEvents={() => {
                            getEvent()
                        }}/>
                </div>
            </>
        );
    }
;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: white,
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
        flexWrap: "nowrap",
        marginBottom: "10vh",

    },
    header: {
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
        width: "100%",
        height: "400px",
        [theme.breakpoints.up('lg')]: {
            height: "440px",
        },
        [theme.breakpoints.down('sm')]: {
            minHeight: "91vh",
        },
        backgroundPosition: "center",
        backgroundSize: "cover",
        color: "white",
        marginBottom: "13px"
    },
    scrim: {
        height: "calc(100% + 200px)",
        width: "100%",
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
        backgroundColor: "rgba(0,0,0,0.40)",
        [theme.breakpoints.down('sm')]: {
            minHeight: "91vh",
        },
        position: "relative",
    },
    headerGrid: {
        margin: "30px",
        width: "90%",
        "& h5": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            "-webkit-line-clamp": 1,
            "-webkit-box-orient": "vertical",
        }

    },
    mainTitle: {
        marginBottom: "1em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        "-webkit-line-clamp": 3,
        "-webkit-box-orient": "vertical",
        [theme.breakpoints.down('sm')]: {
            "-webkit-line-clamp": 6,
        },
    },
    runButton: {
        marginRight: theme.spacing(3),
        borderRadius: 100,
    },
    deleteButton: {
        color: "white",
        backgroundColor: red[500],
        "&:hover": {
            backgroundColor: red[500],
        },
    },
    buttons: {
        width: "90%",
        position: "absolute",
        bottom: "20px",
    },
    body: {
        width: "60%",
        [theme.breakpoints.down('sm')]: {
            width: "92%",
        },
    },
    element: {
        "&>*": {
            margin: theme.spacing(1),
        }
    },
    divider: {
        width: "100%",
        margin: "15px 0 10px 0"
    },
    map: {
        width: '100%',
        height: '75vh'
    },
    loadingBar: {
        width: "100%",
        marginTop: "-13px",
    },
    warning: {
        width: "60%",
        margin: theme.spacing(2),
    },
    headerTextFieldInput: {
        fontSize: "3em",
        lineHeight: "1.1em",
    },
    headerTextField: {
        marginBottom: theme.spacing(5),
    },
    changePictureButton: {
        marginLeft: theme.spacing(3)
    },
    mapBox: {
        margin: theme.spacing(2),
        display: "block",
    },
    mapContainer: {
        "& .map": {
            maxHeight: '75vh'
        }
    },
    participantsContainer: {
        width: "96%",
        marginLeft: "6vw",
        [theme.breakpoints.down('md')]: {
            marginLeft: "2vw",
        }
    },
    feedbackForm: {
        display: "flex",
        flexDirection: "column",
        "&>*": {
            margin: theme.spacing(1),
        }
    }

}))


function mapStateToProps(state) {
    return {
        token: state.auth.token,
        profileId: state.profile.id,
        isAuthenticated: state.auth.token !== undefined,
        isAuthLoading: state.auth.loading,
    };
}


export default connect(
    mapStateToProps,
)(EventContainer);