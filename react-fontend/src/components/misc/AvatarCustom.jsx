import React from 'react';
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from "@material-ui/core/styles";

/**
 * This avatar given first and last name, if src is not available, then the first two capital letter of the name are taken
 */
const AvatarCustom = (props) => {
    const classes = useStyles();
    const {children, src, alt, className, firstName, lastName} = props;

    let charName
    if (alt === undefined && children === undefined) {
        charName = (firstName !== "" ? firstName.toUpperCase().charAt(0) : "") + (lastName !== "" ? lastName.toUpperCase().charAt(0) : "");
    } else {
        if (children !== undefined) {
            return (
                <Avatar
                    src={src}
                    className={`${classes.root} ${className}`}>
                    {children}
                </Avatar>
            )
        } else
            charName = alt.split(" ").map(item => (item.toUpperCase().charAt(0))).join("")
    }

    return (
        <Avatar
            src={src}
            className={`${classes.root} ${className}`}>
            {charName !== "" ? charName : null}
        </Avatar>
    );
};
const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(theme.palette.secondary.dark),
        backgroundColor: theme.palette.secondary.dark,
    },
}));

export default AvatarCustom;