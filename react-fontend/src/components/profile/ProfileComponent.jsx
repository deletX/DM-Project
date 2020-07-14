import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import {white} from "color-name";
import AvatarCustom from "../AvatarCustom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: white,
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
        "& > *": {
            margin: 10,
        },
        marginBottom: theme.spacing(3),
    },
    avatar: {
        height: "20vw",
        maxHeight: "120px",
        width: "20vw",
        maxWidth: "120px",
        fontSize: "min(max(8vw, 2em), 3em)",
        marginTop: 25,
    }
}))

const ProfileComponent = ({profile}) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AvatarCustom alt={`${profile.user.first_name} ${profile.user.last_name}`} src={profile.picture}
                          className={classes.avatar}>
            </AvatarCustom>
            <Rating readOnly value={profile.average_vote === null ? 0 : profile.average_vote}
                    disabled={profile.average_vote === null} precision={.5} size="large" className={classes.rating}/>
        </div>
    )
};

export default ProfileComponent;