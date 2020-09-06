import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {CircularProgress} from "@material-ui/core";

/**
 * Event Computing (just a {@link CircularProgress})
 */
const Computing = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CircularProgress className={classes.loading} size="80px"/>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        minHeight: "400px",
        position: "relative"
    },
    loading: {
        position: "absolute",
        top: "calc(50% - 40px)",
        left: "calc(50% - 40px)",
    }
}));


export default Computing;