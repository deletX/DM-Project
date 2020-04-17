import Chip from "@material-ui/core/Chip";
import React, {useEffect, useState} from 'react';
import DoneIcon from '@material-ui/icons/Done';
import {makeStyles} from "@material-ui/core/styles";
import {white} from "color-name";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: white,
        alignItems: 'left',
        display: 'flex',
    },
    chip: {
        marginRight: 15,
    }
}));

const ChipBox = ({joinable, joined, owned, changeValues}) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Chip
                className={classes.chip}
                label="Joinable"
                onClick={() => (changeValues(!joinable, joined, owned))}
                color={joinable ? "secondary" : "default"}
                icon={joinable ? <DoneIcon/> : ""}
            />
            <Chip
                className={classes.chip}
                label="Joined"
                onClick={() => (changeValues(joinable, !joined, owned))}
                color={joined ? "secondary" : "default"}
                icon={joined ? <DoneIcon/> : ""}
            />
            <Chip
                className={classes.chip}
                label="Owned"
                onClick={() => (changeValues(joinable, joined, !owned))}
                color={owned ? "secondary" : "default"}
                icon={owned ? <DoneIcon/> : null}
            />
        </div>
    )
}

export default ChipBox;