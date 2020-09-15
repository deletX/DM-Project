import Grid from "@material-ui/core/Grid";
import GoogleLogin from "react-google-login";
import {CLIENT_ID} from "../../constants/constants";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as GoogleIcon} from "../../icons/GoogleLogo.svg";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

/**
 * Encloses the GoogleLogin (see {@link https://github.com/anthonyjgrove/react-google-login}) component to remove
 * redundant code and wraps it in a {@link Grid} item (`xs=12`)
 */
const GoogleLoginButton = (props) => {
    const classes = useStyles();

    return (
        <Grid item xs={12}>
            <GoogleLogin
                isSignedIn={false}
                onSuccess={props.onSuccess}
                onFailure={() => {
                }}
                clientId={CLIENT_ID}
                render={
                    renderProps => (
                        <Button variant="contained"
                                className={classes.googleLogin}
                                onClick={renderProps.onClick}
                                startIcon={
                                    <SvgIcon
                                        component={GoogleIcon}
                                        viewBox="0 0 533.5 544.3"/>
                                }
                        >
                            {props.children}
                        </Button>
                    )}/>
        </Grid>
    )
}

const useStyles = makeStyles((theme) => ({
    googleLogin: {
        width: '100%',
        backgroundColor: "white"
    }
}));

export default GoogleLoginButton