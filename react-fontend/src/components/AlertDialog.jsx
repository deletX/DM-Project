import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    primaryButton: {
        color: theme.palette.primary.dark,
    },
    secondaryButton: {
        color: theme.palette.secondary.dark,
    },
}));

const AlertDialog = ({open, handleClose, title, contentText, yesText, noText, onYes, onNo}) => {
    const classes = useStyles();
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onNo} className={classes.secondaryButton} autoFocus>
                    {noText}
                </Button>
                <Button onClick={onYes} className={classes.primaryButton}>
                    {yesText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AlertDialog;