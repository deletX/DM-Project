import {connect} from "react-redux";
import React, {useEffect, useState} from 'react';
import {addEvent, home, homeJoinableJoinedOwned, login} from "../constants/pagesurls";
import {makeStyles} from "@material-ui/core/styles";
import {white} from "color-name";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import {AddBox} from "@material-ui/icons";
import {handleError, useQuery} from "../utils/utils";
import ChipBox from "../components/event/ChipBox";
import EventCard from "../components/event/EventCard";
import Grid from "@material-ui/core/Grid";
import {Helmet} from "react-helmet";
import {useHistory} from "react-router-dom";
import {getEventsList} from "../utils/api";
import {useSnackbar} from 'notistack';


const HomeContainer = ({addError, isAuthenticated, isLoading, search, token}) => {
    let history = useHistory()
    const classes = useStyles();
    const {enqueueSnackbar,} = useSnackbar();

    let query = useQuery();
    let joinable = query.get("joinable") === null ? true : query.get("joinable") === "true"
    let joined = query.get("joined") === null ? true : query.get("joined") === "true"
    let owned = query.get("owned") === null ? false : query.get("owned") === "true"

    const [events, setEvents] = useState(null);
    let eventsFiltered = events;

    if (events !== null)
        eventsFiltered = eventsFiltered.filter((item) => (item.name.includes(search)))

    let eventCards = []

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

    const refreshEvents = (joinable = query.get("joinable") === null ? true : query.get("joinable") === "true",
                           joined = query.get("joined") === null ? true : query.get("joined") === "true",
                           owned = query.get("owned") === null ? false : query.get("owned") === "true") => {
        console.log(joinable, joined, owned)
        getEventsList(joinable, joined, owned, token,
            (res) => {
                setEvents(res.data)
                //handleSuccess(enqueueSnackbar, "Successfully retrieved events list")
            },
            (err) => {
                console.error(err)
                handleError(enqueueSnackbar, "An Error occurred while retrieving events")
                //addError("An Error occurred while retrieving events")
            })
    }

    useEffect(() => {
        if (!(isAuthenticated || isLoading))
            history.push(`${login}?next=${encodeURI(home)}`)
        else if (isAuthenticated)
            refreshEvents(joinable, joined, owned); // eslint-disable-next-line
    }, [joinable, joined, owned, isAuthenticated, isLoading]);

    if (eventsFiltered !== null)
        eventCards = eventsFiltered.map((item) => (
            <Grid key={item.id} item className={classes.cardGridItem}>
                <EventCard event={item} refreshEvents={refreshEvents}/>
            </Grid>
        ))

    return (
        <div className={classes.root}>
            <Helmet>
                <title>DM Project - Event Page</title>
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


const mapStateToProps = state => {
    return {
        token: state.auth.token,
        isAuthenticated: state.auth.token !== undefined,
        isLoading: state.auth.loading,
        search: state.search,
    };
};


export default connect(mapStateToProps,)(HomeContainer)