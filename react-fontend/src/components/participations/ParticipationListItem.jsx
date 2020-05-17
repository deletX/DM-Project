import React from 'react';
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItem from "@material-ui/core/ListItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import Divider from "@material-ui/core/Divider";
import {history} from "../../App";
import {profile} from "../../constants/pagesurls";
import AvatarCustom from "../AvatarCustom";

const useStyles = makeStyles((theme) => ({
    textContainer: {
        position: "relative",
        width: "100%",
    },
    rating: {},
    car: {
        top: "0px",
        position: "absolute",
        right: "3px"
    },
    feet: {
        top: "0px",
        position: "absolute",
        right: "3px"
    },
    name: {},
}));

const ParticipationListItem = ({participation, onlyDriverIcon = false, profileId = undefined}) => {
    const classes = useStyles();
    return (
        <>
            <ListItem>
                <ListItemAvatar>
                    <AvatarCustom firstName={participation.profile.first_name}
                                  lastName={participation.profile.last_name}
                                  src={participation.profile.picture}/>
                </ListItemAvatar>
                <ListItemText
                    onClick={(e) => {
                        history.push(profile(participation.profile.id))
                    }}
                    primary={
                        <div className={classes.textContainer}>
                            <Typography className={classes.name}
                                        color={profileId && profileId === participation.profile.id && onlyDriverIcon ? "primary" : "textPrimary"}>
                                {participation.profile.first_name} {participation.profile.last_name}
                            </Typography>
                            {participation.car !== null ?
                                <>
                                    {(!onlyDriverIcon || participation.pickup_index === 0) &&
                                    <DirectionsCarIcon color="primary" className={classes.car}/>
                                    }
                                </>
                                :
                                <>
                                    {!onlyDriverIcon &&
                                    <EmojiPeopleIcon color="secondary" className={classes.feet}/>
                                    }
                                </>

                            }
                        </div>
                    }
                    secondary={<Rating name={`${participation.profile.id}-rating`}
                                       value={participation.profile.average_vote}
                                       readOnly disabled={participation.profile.average_vote === null} size="small"
                                       className={classes.rating}/>}
                />
            </ListItem>
            {onlyDriverIcon && participation.pickup_index === 0 &&
            <Divider
                component="li"/>
            }
        </>
    );
};

export default ParticipationListItem;