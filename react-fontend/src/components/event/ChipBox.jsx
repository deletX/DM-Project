import Chip from "@material-ui/core/Chip";
import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import {makeStyles} from "@material-ui/core/styles";
import {white} from "color-name";

/**
 * Container of Chips used to toggle joinable, joined or owned filters
 */
const ChipBox = (props) => {
    const classes = useStyles()
    const {joinable, joined, owned, setJoinable, setJoined, setOwned} = props;

    return (
        <div className={classes.root}>
            <Chip
                className={classes.chip}
                label="Joinable"
                onClick={() => (setJoinable(!joinable))}
                color={joinable ? "secondary" : "default"}
                icon={joinable ? <DoneIcon/> : null}
            />
            <Chip
                className={classes.chip}
                label="Joined"
                onClick={() => (setJoined(!joined))}
                color={joined ? "secondary" : "default"}
                icon={joined ? <DoneIcon/> : null}
            />
            <Chip
                className={classes.chip}
                label="Owned"
                onClick={() => (setOwned(!owned))}
                color={owned ? "secondary" : "default"}
                icon={owned ? <DoneIcon/> : null}
            />
        </div>
    )
}

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

export default ChipBox;