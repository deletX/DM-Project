import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {useHistory} from "react-router-dom";
import {connect} from 'react-redux';
import {readNotification} from "../../actions/notificationsActions";
import {useSnackbar} from "notistack";

/**
 * Notification item ({@link ListItem} and {@link Divider}) with an arrow Left, title and content.
 */
const NotificationItem = (props) => {
    const {enqueueSnackbar,} = useSnackbar()
    let history = useHistory()
    const {notification, readNotification} = props;

    return (
        <>
            <ListItem
                alignItems="flex-start"
                button
                disabled={notification.read}
                onClick={() => {
                    readNotification(notification.id, true, enqueueSnackbar);
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


function mapDispatchToProps(dispatch) {
    return {
        readNotification:
            (id, read, enqueueSnackbar) =>
                dispatch(readNotification(id, read, enqueueSnackbar))
    };
}


export default connect(
    null, mapDispatchToProps
)(NotificationItem);