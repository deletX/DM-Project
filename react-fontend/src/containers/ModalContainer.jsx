import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";


const ModalContainer = (props) => {
    const classes = useStyles();

    return (

        <Modal className={classes.root} open={props.open} onClose={props.close} disableEnforceFocus={true}
               disableAutoFocus={true}
               style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <Paper className={classes.paper}>
                <div className={classes.header}>
                    {props.header}
                </div>
                <Divider style={{width: '95%'}}/>
                <div className={classes.children}>
                    {props.children}
                </div>
            </Paper>
        </Modal>
    )
}


const useStyles = makeStyles((theme) => ({
    root: {
        '& *': {
            outline: 'none',
        },
        alignItems: 'center',
        justifyContent: 'center',
        outline: "none",
        overflow: 'hidden',
        display: 'flex',
    },
    paper: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
        // flexWrap: 'wrap',
        maxWidth: "60%",
        maxHeight: "90%",
        minWidth: '300px',
        margin: 5,
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        margin: 10,
    },
    children: {
        margin: 5,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        outline: 'none',
        overflowY: "auto",

    },
}))


export default ModalContainer