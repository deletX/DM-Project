import React, {useState} from 'react';
import {TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FeedbacksComponent from "../feedback/FeedbacksComponent";
import {makeStyles} from "@material-ui/core/styles";
import {white} from "color-name";
import {Helmet} from "react-helmet";

const useStyles = makeStyles((theme) => ({
    grid: {
        marginBottom: theme.spacing(5),
    },
    feedbacks: {
        marginBottom: theme.spacing(8),
    }

}))

const OtherProfileComponent = ({profile}) => {
    const classes = useStyles();
    return (
        <div>
            <Helmet>
                <title>React App - {profile.username ? profile.username : ""} profile</title>
                <meta name="description" content="Profile page"/>
            </Helmet>
            <Grid container spacing={5} className={classes.grid}>
                <Grid item xs={6}>
                    <Typography variant="h4">
                        {profile.user.first_name}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h4">
                        {profile.user.last_name}
                    </Typography>
                </Grid>
            </Grid>
            {profile.received_feedback.length > 0 ?
                <FeedbacksComponent feedbacks={profile.received_feedback} edit={false}/>
                :
                <Typography className={classes.feedbacks}>
                    This user hasn't received any feedback, yet ;)
                </Typography>
            }
        </div>
    )
};

export default OtherProfileComponent;