import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));

export default function NotificationItem({notification, history}) {
    const classes = useStyles();

    return (
        <>
            <ListItem alignItems="flex-start" disabled={notification.read} component="a" href="#"
                      onClick={history.push(notification.url)}>
                <ListItemAvatar>
                    <ArrowForwardIosIcon/>
                </ListItemAvatar>
                <ListItemText
                    primary={notification.title}
                    secondary={notification.content}
                />
            </ListItem>
            <Divider variant="inset" component="li"/>
        </>
    );
}