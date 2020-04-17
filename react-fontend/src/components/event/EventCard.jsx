import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {white} from "color-name";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

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
    secondryButton: {
        color: theme.palette.secondary.dark,
    }
}));

const EventCard = ({event}) => {
    const classes = useStyles()

    let date = new Date(event.date_time)
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={event.picture}
                    title={event.name}
                />
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
                <Button className={classes.primaryButton}>Join</Button>
                <Button className={classes.primaryButton}>Edit</Button>
                <Button className={classes.secondryButton}>Details</Button>
            </CardActions>
        </Card>
    )
}

export default EventCard