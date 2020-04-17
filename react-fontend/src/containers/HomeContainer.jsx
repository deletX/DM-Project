import {connect} from "react-redux";
import React, {useEffect, useState} from 'react';
import {history} from "../App";
import {home, login} from "../constants/pagesurls";
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
import {headers} from "../utils";
import {authSignup, googleOAuthLogin} from "../actions/authActions";
import {changePicture, createCar} from "../actions/profileActions";
import {addAlert} from "../actions/alertActions";
import axios from "axios";
import ChipBox from "../components/event/ChipBox";
import EventCard from "../components/event/EventCard";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

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

const HomeContainer = ({isAuthenticated, search, token}) => {
    useEffect(() => {
        if (!isAuthenticated) history.push(login)

        if (events === null)
            axios
                .get(eventListURL(joinable, joined, owned), headers('application/json', token))
                .then((response) => {
                    setEvents(response.data)
                })
                .catch((err) => {
                    addAlert("An Error occurred while retrieving events")
                });
    });
    const classes = useStyles();


    const [joinable, setJoinable] = useState(true);
    const [joined, setJoined] = useState(true);
    const [owned, setOwned] = useState(false);
    const [events, setEvents] = useState(null);
    let eventsFiltered = events;

    if (events !== null)
        eventsFiltered = eventsFiltered.filter((item) => (item.name.includes(search)))

    const changeValues = (joinable, joined, owned) => {
        setJoinable(joinable)
        setJoined(joined);
        setOwned(owned);
        setEvents(null);
    }

    let eventCards = []
    if (eventsFiltered !== null)
        eventCards = eventsFiltered.map((item) => (
            <Grid key={item.id} item className={classes.cardGridItem}>
                <EventCard event={item}/>
            </Grid>
        ))
    console.log(eventsFiltered)
    return (
        <div className={classes.root}>
            <div className={classes.firstLine}>
                <Typography variant="h2">
                    Events
                    <IconButton className={classes.plusButton} aria-label="add">
                        <AddBox fontSize="large"/>
                    </IconButton>
                </Typography>


                <ChipBox joined={joined} joinable={joinable} owned={owned} changeValues={changeValues}/>
            </div>
            <Grid container xs={12} spacing={3} className={classes.gridContainer}>
                {eventCards}
            </Grid>
        </div>
    )

}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        isAuthenticated: state.auth.token !== undefined,
        search: state.search,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addError: (text) => dispatch(addAlert(text, "error")),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)