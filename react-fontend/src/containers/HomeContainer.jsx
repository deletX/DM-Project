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


const HomeContainer = (props) => {
    let history = useHistory()
    const classes = useStyles();
    const {enqueueSnackbar,} = useSnackbar();
    const {isAuthenticated, isLoading, search, token} = props;

    const [events, setEvents] = useState(null);

    let query = useQuery();
    let joinable = query.get("joinable") === null ? true : query.get("joinable") === "true"
    let joined = query.get("joined") === null ? true : query.get("joined") === "true"
    let owned = query.get("owned") === null ? false : query.get("owned") === "true"

    /**
     * Set the joinable filter
     *
     * @param {boolean} joinable
     */
    const setJoinable = (joinable) => {
        history.push(homeJoinableJoinedOwned(joinable, joined, owned))
    }

    /**
     * Set the joined filter
     *
     * @param {boolean} joined
     */
    const setJoined = (joined) => {
        history.push(homeJoinableJoinedOwned(joinable, joined, owned))
    }

    /**
     * Set the owned filter
     *
     * @param {boolean} owned
     */
    const setOwned = (owned) => {
        history.push(homeJoinableJoinedOwned(joinable, joined, owned))
    }

    /**
     * Retrieve the event list calling the respective API
     *
     * @param {boolean} joinable joinable filter
     * @param {boolean} joined joined filter
     * @param {boolean} owned owned filter
     */
    const refreshEvents = (joinable = query.get("joinable") === null ? true : query.get("joinable") === "true",
                           joined = query.get("joined") === null ? true : query.get("joined") === "true",
                           owned = query.get("owned") === null ? false : query.get("owned") === "true") => {
        getEventsList(joinable, joined, owned, token,
            (res) => {
                setEvents(res.data)
            },
            (err) => {
                handleError(enqueueSnackbar, "Something went wrong while retrieving events [042]", err)
            })
    }

    // filtered by the search term
    let eventsFiltered = events;
    if (events !== null)
        eventsFiltered = eventsFiltered.filter((item) => (item.name.toUpperCase().includes(search.toUpperCase())))
    let eventCards = []
    if (eventsFiltered !== null)
        eventCards = eventsFiltered.map((item) => (
            <Grid key={item.id} item className={classes.cardGridItem}>
                <EventCard event={item} refreshEvents={refreshEvents}/>
            </Grid>
        ))

    useEffect(() => {
        if (!(isAuthenticated || isLoading))
            history.push(`${login}?next=${encodeURI(home)}`)
        else if (isAuthenticated)
            refreshEvents(joinable, joined, owned); //eslint-disable-next-line
    }, [joinable, joined, owned, isAuthenticated, isLoading]);


    return (
        <div className={classes.root}>
            <Helmet>
                <title>DM Project - Events Page</title>
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