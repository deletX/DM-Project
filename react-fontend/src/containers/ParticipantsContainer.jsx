import React from 'react';
import ParticipationListItem from "../components/participations/ParticipationListItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";


const ParticipantsContainer = ({participantSet, profileId = -1, onlyDriverIcon = false}) => {
        const classes = useStyles();

        const participation = participantSet.find((part) => (part.profile.id === profileId))

        if (!onlyDriverIcon)
            participantSet = participantSet.filter((item) => (item.profile.id !== profileId))

        let participations = participantSet.map(item => (
            <ParticipationListItem key={item.id} participation={item} onlyDriverIcon={onlyDriverIcon}
                                   profileId={profileId}/>
        ))

        if (participation && !onlyDriverIcon)
            participations.unshift(
                <>
                    <ParticipationListItem key={participation.id}
                                           participation={participation}/>
                    <Divider
                        component="li" key={-1}/>
                </>)

        return (
            <div>
                <List className={classes.root}>
                    {participations}
                </List>
            </div>
        );
    }
;


const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.down('md')]: {
            width: "100%",
        },
        maxHeight: "60vh",
    },
}));


export default ParticipantsContainer;