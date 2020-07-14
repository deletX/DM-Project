import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {useHistory} from "react-router-dom";
import {connect} from 'react-redux';
import {readNotification} from "../../actions/notificationsActions";

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

const NotificationItem = ({notification, readNotification}) => {
    const classes = useStyles();
    let history=useHistory()

    return (
        <>
            <ListItem alignItems="flex-start" button disabled={notification.read}
                      onClick={() => {
                          readNotification(notification.id);
                          history.push(notification.url)
                      }}>
                <ListItemAvatar>
                    <ArrowForwardIosIcon/>
                </ListItemAvatar>
                <ListItemText
                    primary={notification.title}
                    secondary={
                        notification.content
                    }
                />

            </ListItem>
            <Divider variant="inset" component="li"/>
        </>
    );
}


function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        readNotification: (id) => dispatch(readNotification(id))
    };
}


export default connect(
    mapStateToProps, mapDispatchToProps
)(NotificationItem);