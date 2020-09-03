import React from 'react';
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {white_text_theme} from "../utils/theme";
import Typography from "@material-ui/core/Typography";
import {white} from "color-name";
import {landingpageback, landingpageEvent, landingpageProfile} from "../constants/constants";
import {login, signup} from "../constants/pagesurls";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Rating from "@material-ui/lab/Rating";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import CardMedia from "@material-ui/core/CardMedia";


const ProfileCard = (props) => {
    const {profile} = props
    return (
        <Card className={props.className}>
            <CardContent style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Avatar src={profile.picture} style={{height: "60px", width: "60px"}}/>
                <Typography variant="h6">
                    {profile.firstName} {profile.lastName}
                </Typography>
                <Rating value={profile.vote} precision={.5} readOnly/>
            </CardContent>
        </Card>
    )
}

const EventCard = (props) => {
    const {event} = props;

    return (
        <Card className={props.className}>
            <CardMedia
                component="img"
                image={event.picture}
                title={event.name}
                style={{
                    height: "60%"
                }}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2" noWrap>
                    {event.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" noWrap>
                    Date: {event.date}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" noWrap>
                    Location: {event.address}
                </Typography>
            </CardContent>
        </Card>
    )
}

const profiles = [
    {
        id: 1,
        picture: landingpageProfile(1),
        firstName: "Laura",
        lastName: "Onio",
        vote: 4.5,
    },
    {
        id: 2,
        picture: landingpageProfile(2),
        firstName: "Luca",
        lastName: "Siciliano",
        vote: 4,
    },
    {
        id: 3,
        picture: landingpageProfile(3),
        firstName: "Angelica",
        lastName: "Piccio",
        vote: 5,
    },
    {
        id: 4,
        picture: landingpageProfile(4),
        firstName: "Cinzia",
        lastName: "Fiorentino",
        vote: 4
    },
    {
        id: 5,
        picture: landingpageProfile(5),
        firstName: "Luigi",
        lastName: "Gallo",
        vote: 5
    },
    {
        id: 6,
        picture: landingpageProfile(6),
        firstName: "Franco",
        lastName: "Schiavone",
        vote: 4.5
    }
]

const events = [
    {
        id: 1,
        picture: landingpageEvent(1),
        name: "Venice Trip",
        date: "28/02/2020",
        address: "Rio Terà Sant'Andrea, 460, 30135 Venezia VE",
    },
    {
        id: 2,
        picture: landingpageEvent(2),
        name: "Stairway 66 Bar Night",
        date: "29/12/2019",
        address: "Via IV Novembre, N 6, 42010 Rio Saliceto RE",
    },
    {
        id: 3,
        picture: landingpageEvent(3),
        name: "New Year in Venice",
        date: "31/12/2019",
        address: "Rio Terà Sant'Andrea, 460, 30135 Venezia VE",
    },
    {
        id: 4,
        picture: landingpageEvent(4),
        name: "Live Radio",
        date: "07/03/2020",
        address: "Via E. De Amicis, 59, 41012 Carpi MO",
    },
    {
        id: 5,
        picture: landingpageEvent(5),
        name: "Hospitality on the beach",
        date: "13/05/2019",
        address: "Ul. Petrića Glava 34, 22240, Tisno, Croatia",
    },
    {
        id: 6,
        picture: landingpageEvent(6),
        name: "Aperitif party",
        date: "19/12/2019",
        address: "Corso Sempione, 1, 20145 Milano MI",
    },

]

const LandingPageContainer = () => {
    const classes = useStyles()

    const profileCards = profiles.map(item => (
        <ListItem>
            <ProfileCard profile={item} key={item.id} className={classes.profileCard}/>
        </ListItem>
    ))

    const eventCards = events.map(item => (
        <ListItem>
            <EventCard event={item} key={item.id} className={classes.eventCard}/>
        </ListItem>
    ))

    return (
        <div>
            <div className={classes.root}>
                <div className={classes.header}>
                    <div className={classes.scrim}>
                        <ThemeProvider theme={white_text_theme}>
                            <div className={classes.content}>
                                <Typography variant="h1" className={classes.title}>
                                    DM Project
                                </Typography>
                                <Typography className={classes.cta}>
                                    Stop driving by yourself. Need to go to an event? Want to organize a travel with your buddies? Join and manage your events or join someone else's!
                                </Typography>
                            </div>
                            <div className={classes.buttons}>
                                <Button href={signup} variant="contained" color="primary">
                                    Sign up
                                </Button>
                                <Button href={login} color="secondary">
                                    See events
                                </Button>
                            </div>
                        </ThemeProvider>
                    </div>
                </div>
                <div className={classes.body}>
                    <div className={classes.element}>
                        <Typography variant="h2">
                            Drivers
                        </Typography>
                        <Typography>
                            Here some of our awesome members, we hope we'll meet each other soon!
                        </Typography>
                        <List className={classes.horizontalList}>
                            {profileCards}
                        </List>
                    </div>
                    <Divider/>
                    <div className={classes.element}>

                        <Typography variant="h2">
                            New Events
                        </Typography>
                        <Typography>
                            Here some of the extraordinary events we had here, join so you are not going to miss anything like this
                        </Typography>
                        <List className={classes.horizontalList}>
                            {eventCards}
                        </List>
                    </div>
                    <Divider/>
                    <div className={classes.element}>
                        <Typography variant="h2">
                            Join Now!
                        </Typography>
                        <Typography>
                            We would love to have you in our community! Click the join button and be ready for your next big event with new and amazing friends!
                        </Typography>
                        <div style={{
                            height: "20vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Button size="large" variant="contained" color="primary" href={signup}>
                                Join!
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


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
        height: "500px",
        [theme.breakpoints.up('lg')]: {
            height: "600px",
        },
        // minHeight: "250px",
        [theme.breakpoints.down('sm')]: {
            height: "calc(100vh - 60px)",
            minHeight: "600px",
            backgroundPosition: "47% 50%",
        },
        backgroundImage: `url(${landingpageback})`,
        backgroundPosition: "50% 50%",
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
            minHeight: "calc(100vh - 60px)",
        },
        position: "relative",
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
    content: {
        [theme.breakpoints.down('sm')]: {
            top: "10%"
        },
        position: "absolute",
        top: "20%",
        left: "20%"
    },
    title: {
        margin: "0 0 40px",
        width: "80%"
    },
    cta: {
        [theme.breakpoints.down('xs')]: {
            width: "70%"
        },
        width: "40%"
    },
    buttons: {
        position: "absolute",
        bottom: "20%",
        left: "20%"
    },

    body: {
        width: "92%",
        [theme.breakpoints.up('lg')]: {
            width: "60%",
        },
    },
    element: {
        "&>*": {
            margin: theme.spacing(1),
        },
        marginBottom: "20px"
    },
    // divider: {
    //     width: "100%",
    //     margin: "15px 0 10px 0"
    // },
    profileCard: {
        width: "200px",
    },
    eventCard: {
        width: "300px",
        height: "270px",
    },
    horizontalList: {
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
        overflowX: "auto",
    }

}))


export default LandingPageContainer;