import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {home} from "../../constants/pagesurls";
import {useHistory} from "react-router-dom";
import {authLogin, googleOAuthLogin} from "../../actions/authActions";
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import LockIcon from '@material-ui/icons/Lock';
import CardContainer from "../../containers/CardContainer";
import AvatarCustom from "../AvatarCustom";
import {Helmet} from "react-helmet";
import {useSnackbar} from 'notistack';
import GoogleLoginButton from "./GoogleLoginButton";

function SignupComponent({authLogin, googleLogin, location}) {
    let history = useHistory()
    const classes = useStyles();
    const {enqueueSnackbar,} = useSnackbar();

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);

    const disabled = !(username.length > 0 && password.length > 0);

    return (
        <CardContainer title="Log in!">
            <Helmet>
                <title>DM Project - Login</title>
            </Helmet>
            <div className={classes.formContainer}>
                <AvatarCustom className={classes.imgPreview}>
                    <LockIcon fontSize="large"/>
                </AvatarCustom>

                <form className={classes.form}>
                    <Grid container spacing={5}>
                        <GoogleLoginButton
                            onSuccess={(input) => {
                                googleLogin(input.accessToken, enqueueSnackbar).catch(err => {
                                    if (!err instanceof Error) {
                                        history.push(location.query.next ? decodeURI(location.query.next) : home)
                                    }
                                })
                            }}
                        />

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
                                    authLogin(username, password, enqueueSnackbar).catch(err => {
                                        if (!err instanceof Error) {
                                            history.push(location.query.next ? decodeURI(location.query.next) : home)
                                        }
                                    })
                                }}
                            >Log in
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>

        </CardContainer>
    )
}


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


const mapDispatchToProps = (dispatch) => {
    return {
        authLogin: (username, password, enqueueSnackbar) => dispatch(authLogin(username, password, enqueueSnackbar)),
        googleLogin: (googleToken, enqueueSnackbar) => dispatch(googleOAuthLogin(googleToken, enqueueSnackbar)),
    };
};


export default connect(null, mapDispatchToProps)(SignupComponent)