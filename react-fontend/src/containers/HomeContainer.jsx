import {connect} from "react-redux";
import React, {useEffect, useState} from 'react';
import {history} from "../App";
import {addEvent, home, homeJoinableJoinedOwned, login} from "../constants/pagesurls";
import {makeStyles} from "@material-ui/core/styles";
import {white} from "color-name";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import AddIcon from '@material-ui/icons/Add';
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import {AddBox, AddCircle} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import {eventListURL} from "../constants/apiurls";
import {headers, useQuery} from "../utils";
import {authSignup, googleOAuthLogin} from "../actions/authActions";
import {changePicture, createCar} from "../actions/profileActions";
import {addAlert} from "../actions/alertActions";
import axios from "axios";
import ChipBox from "../components/event/ChipBox";
import EventCard from "../components/event/EventCard";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import {useLocation} from "react-router";
import {Helmet} from "react-helmet";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '100vw',
        backgroundColor: white,
        alignItems: 'left',
        flexDirection: 'column',
        display: 'flex',
    },
    firstLine: {
        "& > h2": {
            marginBottom: 5,
        },
        display: 'inline',
        alignItems: "initial",
        marginTop: 13,
        marginLeft: 20,
    },
    plusButton: {
        marginLeft: 10,
        color: theme.palette.secondary.dark,
    },
    cardGridItem: {
        marginTop: 3,
    },
    gridContainer: {
        width: '90%',
        marginTop: 3,
        alignItems: 'center',
        flexDirection: 'left',
        display: 'flex',
        marginLeft: 10,
    }

}));


const HomeContainer = ({addError, isAuthenticated, isLoading, search, token}) => {
    let history=useHistory()
    let query = useQuery();

    const classes = useStyles();

    let joinable = query.get("joinable") === null ? true : query.get("joinable") === "true"
    let joined = query.get("joined") === null ? true : query.get("joined") === "true"
    let owned = query.get("owned") === null ? false : query.get("owned") === "true"

    useEffect(() => {
        if (!(isAuthenticated || isLoading))
            history.push(`${login}?next=${encodeURI(home)}`)
        else if (isAuthenticated)
            refreshEvents(joinable, joined, owned);
    }, [joinable, joined, owned, isAuthenticated, isLoading]);


    const setJoinable = (joinable) => {
        history.push(homeJoinableJoinedOwned(joinable, joined, owned))
        // refreshEvents(joinable, joined, owned);
    }
    const setJoined = (joined) => {
        history.push(homeJoinableJoinedOwned(joinable, joined, owned))
        // refreshEvents(joinable, joined, owned);
    }
    const setOwned = (owned) => {
        history.push(homeJoinableJoinedOwned(joinable, joined, owned))
        // refreshEvents(joinable, joined, owned);
    }

    const [events, setEvents] = useState(null);
    let eventsFiltered = events;


    const refreshEvents = (joinable = query.get("joinable") === null ? true : query.get("joinable") === "true",
                           joined = query.get("joined") === null ? true : query.get("joined") === "true",
                           owned = query.get("owned") === null ? false : query.get("owned") === "true") => {
        console.log(joinable, joined, owned)
        axios
            .get(eventListURL(joinable, joined, owned), headers('application/json', token))
            .then((response) => {
                setEvents(response.data)
            })
            .catch((err) => {
                addError("An Error occurred while retrieving events")
            });
    }

    if (events !== null)
        eventsFiltered = eventsFiltered.filter((item) => (item.name.includes(search)))

    let eventCards = []
    if (eventsFiltered !== null)
        eventCards = eventsFiltered.map((item) => (
            <Grid key={item.id} item className={classes.cardGridItem}>
                <EventCard event={item} refreshEvents={refreshEvents}/>
            </Grid>
        ))
    return (
        <div className={classes.root}>
            <Helmet>
                <title>React App - Event Page</title>
                <meta name="description" content="Main Home page"/>
            </Helmet>
            <div className={classes.firstLine}>
                <Typography variant="h2">
                    Events
                    <IconButton className={classes.plusButton} aria-label="add" onClick={() => {
                        history.push(addEvent)
                    }}>
                        <AddBox fontSize="large"/>
                    </IconButton>
                </Typography>


                <ChipBox joined={joined} joinable={joinable} owned={owned} setJoined={setJoined}
                         setJoinable={setJoinable}
                         setOwned={setOwned}/>
            </div>
            <Grid container spacing={3} className={classes.gridContainer}>
                {eventCards}
            </Grid>
        </div>
    )

}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        isAuthenticated: state.auth.token !== undefined,
        isLoading: state.auth.loading,
        search: state.search,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addError: (text) => dispatch(addAlert(text, "error")),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)