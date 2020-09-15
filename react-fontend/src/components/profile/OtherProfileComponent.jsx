import React from 'react';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FeedbacksComponent from "../feedback/FeedbacksComponent";
import {makeStyles} from "@material-ui/core/styles";
import {Helmet} from "react-helmet";

/**
 * Component for other profiles (not the user one). It hasn't the car section and the given feedback as well.
 */
const OtherProfileComponent = (props) => {
    const classes = useStyles();

    return (
        <div>
            <Helmet>
                <title>
                    DM
                    Project{props.profile.user.first_name && ` - ${props.profile.user.first_name.charAt(0).toUpperCase() + props.profile.user.first_name.slice(1)}'s  Profile`}
                </title>
                <meta name="description" content="Profile page"/>
            </Helmet>
            <Grid container spacing={5} className={classes.grid}>
                <Grid item xs={6}>
                    <Typography variant="h4">
                        {props.profile.user.first_name}
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="h4">
                        {props.profile.user.last_name}
                    </Typography>
                </Grid>
            </Grid>

            {props.profile.received_feedback.length > 0 ?
                <FeedbacksComponent
                    feedbacks={props.profile.received_feedback}
                    edit={false}
                />
                :
                <Typography className={classes.feedbacks}>
                    This user hasn't received any feedback, yet ;)
                </Typography>
            }
        </div>
    )
};

const useStyles = makeStyles((theme) => ({
    grid: {
        marginBottom: theme.spacing(5),
    },
    feedbacks: {
        marginBottom: theme.spacing(8),
    }

}))

export default OtherProfileComponent;