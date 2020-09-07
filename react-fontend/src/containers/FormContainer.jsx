import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {white} from "color-name";


/**
 * Simple container with a {@link Paper} background
 */
const FormContainer = (props) => {
    const classes = useStyles();
    const {children, effect} = props;

    useEffect(() => {
        effect()
    });

    return (
        <div className={classes.root}>
            <Paper className={classes.formPaper}>
                {children}
            </Paper>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: white,
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    formPaper: {
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        margin: 20,
        width: '90vw',
        maxWidth: '600px',
        minWidth: '320px',
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.down('sm')]: {
            overflowX: "hidden",
            margin: 0,
            width: '100vw',
        },
    },
    inline: {
        display: 'inline',
    },
}));

export default FormContainer;