import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {white} from "color-name";
import Divider from "@material-ui/core/Divider";
import {Stepper} from "@material-ui/core";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import PersonalInfoForm from "./signup/PersonalInfoForm";
import StepContent from "@material-ui/core/StepContent";
import CarForm from "./signup/CarForm";
import SummaryData from "./signup/SummaryData";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {home, signup} from "../../constants/pagesurls";
import {history} from "../../App";
import {authCheckState, authLogin, authSignup, googleOAuthLogin} from "../../actions/authActions";
import {connect} from "react-redux";
import {changePicture, createCar} from "../../actions/profileActions";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import GoogleLogin from "react-google-login";
import axios from "axios";
import {CLIENT_ID} from "../../constants/constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as GoogleIcon} from "../../icons/GoogleLogo.svg";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import {PhotoCamera} from "@material-ui/icons";
import Input from "@material-ui/core/Input";
import LockIcon from '@material-ui/icons/Lock';
import {addAlert} from "../../actions/alertActions";

const useStyles = makeStyles((theme) => ({
    title: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
    root: {
        width: '95%',
        margin: 10
    },
    formContainer: {
        marginBottom: theme.spacing(2),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    loading: {
        marginBottom: theme.spacing(5),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    loadingTypography: {
        marginBottom: theme.spacing(2),
    },
    form: {
        width: '90%',
    },
    googleLogin: {
        width: '100%',
        height: 45,
        backgroundColor: "white",
        marginTop: theme.spacing(2),
    },
    button: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    imgPreview: {
        color: theme.palette.getContrastText(theme.palette.secondary.dark),
        backgroundColor: theme.palette.secondary.dark,
        margin: 10,
        maxWidth: '9ch',
        minWidth: '6ch',
        maxHeight: '9ch',
        minHeight: '6ch',
    }

}));


function SignupComponent({authLogin, googleLogin, addError}) {

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [open, setOpen] = useState(false);

    const classes = useStyles();

    const disabled = !(username.length > 0 && password.length > 0);

    return (
        <div className={classes.root}>
            <Typography variant="h5" align="center" className={classes.title}>
                Log in!
            </Typography>
            <Divider/>
            <div className={classes.formContainer}>
                <Avatar className={classes.imgPreview}>
                    <LockIcon fontSize="large"/>
                </Avatar>

                <form className={classes.form}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <GoogleLogin
                                isSignedIn={false}
                                onSuccess={(input) => {
                                    let username = input.profileObj.email.split("@")[0]
                                    googleLogin(input.accessToken).catch(err => {
                                        if (!err instanceof Error) {
                                            history.push(home)
                                        } else {
                                            addError("An error occurred while logging you in with google")
                                            console.log(err)
                                        }
                                    })

                                }}
                                onFailure={() => {
                                }}
                                clientId={CLIENT_ID} render={renderProps => (
                                <Button variant="contained"
                                        className={classes.googleLogin}
                                        onClick={renderProps.onClick}
                                        startIcon={<SvgIcon component={GoogleIcon} viewBox="0 0 533.5 544.3"/>}
                                >
                                    Login with Google
                                </Button>
                            )}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="outlined"
                                       fullWidth
                                       required id="username"
                                       label="Username"
                                       value={username}
                                       placeholder="jamesbond007"
                                       helperText="Required"
                                       onChange={(input) => {
                                           setUsername(input.target.value);
                                           setUsernameError(input.target.value.length === 0);
                                       }}
                                       onBlur={(input) => {
                                           setUsername(input.target.value);
                                           setUsernameError(input.target.value.length === 0);
                                       }}
                                       error={usernameError}
                                       autoComplete="username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="outlined"
                                       fullWidth
                                       required id="password"
                                       label="Password"
                                       error={passwordError}
                                       value={password}
                                       type="password"
                                       helperText="Required"
                                       onChange={(input) => {
                                           setPassword(input.target.value);
                                           setPasswordError(input.target.value.length === 0);
                                       }}
                                       onBlur={(input) => {
                                           setPassword(input.target.value);
                                           setPasswordError(input.target.value.length === 0);
                                       }}
                                       autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                component="label"
                                justify="flex-end"
                                className={classes.button}
                                disabled={disabled}
                                onClick={() => {
                                    authLogin(username, password).catch(err => {
                                        if (!err instanceof Error) {
                                            history.push(home)
                                        } else {
                                            addError("An error occurred while logging you in")
                                            console.log(err)
                                        }
                                    })
                                }}
                            >Log in
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>

            <Backdrop className={classes.backdrop} open={open}>
                <Box className={classes.loading}>
                    <Typography className={classes.loadingTypography}>
                        Loading your data!
                    </Typography>
                    <CircularProgress color="inherit"/>
                </Box>
            </Backdrop>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        authLogin: (username, password) => dispatch(authLogin(username, password)),
        googleLogin: (googleToken) => dispatch(googleOAuthLogin(googleToken)),
        addError: (text) => dispatch(addAlert(text, "error")),
    };
};


export default connect(null, mapDispatchToProps)(SignupComponent)