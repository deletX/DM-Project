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


const NotificationItem = ({notification, readNotification}) => {
    const {enqueueSnackbar,} = useSnackbar()
    let history = useHistory()

    return (
        <>
            <ListItem
                alignItems="flex-start"
                button
                disabled={notification.read}
                onClick={() => {
                    readNotification(notification.id, enqueueSnackbar);
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
            (id, enqueueSnackbar) =>
                dispatch(readNotification(id, enqueueSnackbar))
    };
}


export default connect(
    null, mapDispatchToProps
)(NotificationItem);