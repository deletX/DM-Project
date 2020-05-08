import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {PhotoCamera} from "@material-ui/icons";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import {CLIENT_ID, defaultProfilePic} from "../../../constants/constants";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import {login} from "../../../constants/pagesurls";
import GoogleLogin from "react-google-login";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as GoogleIcon} from '../../../icons/GoogleLogo.svg'
import Alert from "@material-ui/lab/Alert";
import axios from "axios"
import AvatarCustom from "../../AvatarCustom";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(2),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
    },

    button: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    imageInput: {
        display: 'none',
    },
    imageProgress: {
        marginLeft: theme.spacing(1),
    },
    imgPreview: {
        color: theme.palette.getContrastText(theme.palette.secondary.dark),
        backgroundColor: theme.palette.secondary.dark,
        margin: 10,
        maxWidth: '9ch',
        minWidth: '6ch',
        maxHeight: '9ch',
        minHeight: '6ch',
    },
    googleLogin: {
        width: '100%',
        backgroundColor: "white"
    },
    editAlert: {
        width: '90%'
    }

}));


const PersonalInfoForm = ({
                              firstName, setFirstName, lastName, setLastName, username, setUsername,
                              usernameError, setUsernameError, password, setPassword, passwordError,
                              setPasswordError, email, setEmail, emailError, setEmailError,
                              image, setImage, imageURL, setImageURL, isGoogleLogin, setGoogleLogin,
                              setGoogleAccessToken, handleNext
                          }) => {
    const classes = useStyles();
    const [emailHelperText, setEmailHelperText] = useState("");
    const [passwordHelperText, setPasswordHelperText] = useState("");
    const [usernameHelperText, setUsernameHelperText] = useState("");

    const validateEmail = (input) => {
        undoGoogleLogin();
        if (input.target.value === null || input.target.value === "") {
            setEmailError(true);
            setEmailHelperText("Required");
        } else if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input.target.value))) {
            setEmailError(true);
            setEmailHelperText("Not a valid email");
        } else {
            setEmailError(false);
            setEmailHelperText("");
        }
        setEmail(input.target.value)
    };

    const validateUsername = (input) => {
        undoGoogleLogin()
        if (input.target.value === null || "" === input.target.value) {
            setUsernameError(true);
            setUsernameHelperText("Required");
        } else {
            setUsernameError(false);
            setUsernameHelperText("");
        }
        setUsername(input.target.value)
    };

    const validatePassword = (input) => {
        undoGoogleLogin()
        if (input.target.value === null || input.target.value === "") {
            setPasswordError(true);
            setPasswordHelperText("Required");
        } else if (!(/^[\w!@#$%^&*]{8,}$/.test(input.target.value))) {
            setPasswordError(true);
            setPasswordHelperText("Should be at least 8 character long");
        } else if (!/^(?=.*[\d])[\w!@#$%^&*]{8,}$/.test(input.target.value)) {
            setPasswordError(true);
            setPasswordHelperText("Should contain at least 1 number");
        } else if (!/^(?=.*[A-Z])(?=.*[\d])[\w!@#$%^&*]{8,}$/.test(input.target.value)) {
            setPasswordError(true);
            setPasswordHelperText("Should contain at least 1 capital");
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])[\w!@#$%^&*]{8,}$/.test(input.target.value)) {
            setPasswordError(true);
            setPasswordHelperText("Should contain at least 1 lowercase");
        } else if (!/^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])[\w!@#$%^&*]{8,}$/.test(input.target.value)) {
            setPasswordError(true);
            setPasswordHelperText("Should contain at least 1 special character");
        } else {
            setPasswordError(false);
            setPasswordHelperText("");
        }
        setPassword(input.target.value)
    };

    const undoGoogleLogin = () => {
        setGoogleAccessToken("");
        setGoogleLogin(false);
    }

    return (
        <div className={classes.root}>
            <AvatarCustom src={imageURL} className={classes.imgPreview} firstName={firstName} lastName={lastName}/>

            <form className={classes.form}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <GoogleLogin
                            isSignedIn={false}
                            onSuccess={(input) => {
                                let username = input.profileObj.email.split("@")[0].replace(' ', '_').replace('.', '_')
                                setGoogleAccessToken(input.accessToken)
                                setGoogleLogin(true)
                                setFirstName(input.profileObj.givenName)
                                setLastName(input.profileObj.familyName)
                                setEmail(input.profileObj.email)
                                setUsername(username)
                                setImageURL(input.profileObj.imageUrl)
                                axios.get(input.profileObj.imageUrl, {responseType: 'blob'}).then(res => {
                                    let blob = res.data
                                    
                                    let type = res.data.type.split('/').pop()
                                    blob.name = `${username}.${type}`
                                    setImage(blob)
                                })
                                    .catch(err => {
                                        console.log(err)
                                    })
                                handleNext()
                            }}
                            onFailure={() => {
                            }}
                            clientId={CLIENT_ID} render={renderProps => (
                            <Button variant="contained"
                                    className={classes.googleLogin}
                                    onClick={renderProps.onClick}
                                    startIcon={<SvgIcon component={GoogleIcon} viewBox="0 0 533.5 544.3"/>}
                            >
                                Signup with Google
                            </Button>
                        )}/>
                    </Grid>
                    {isGoogleLogin &&
                    <Grid item xs={12}>
                        <Alert className={classes.editAlert} severity="warning">Editing these info will undo your Google
                            Signup</Alert>
                    </Grid>
                    }
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" fullWidth id="name" label="First Name" placeholder="James"
                                   value={firstName}
                                   onChange={(input) => {
                                       undoGoogleLogin();
                                       setFirstName(input.target.value)
                                   }}
                                   autoComplete="name"/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" fullWidth id="surname" label="Last Name" placeholder="Bond"
                                   value={lastName}
                                   onChange={(input) => {
                                       undoGoogleLogin();
                                       setLastName(input.target.value)
                                   }}
                                   autoComplete="family-name"/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined"
                                   fullWidth
                                   required id="username"
                                   label="Username"
                                   value={username}
                                   placeholder="jamesbond007"
                                   helperText={usernameHelperText}
                                   onChange={validateUsername}
                                   onBlur={validateUsername}
                                   error={usernameError}
                                   autoComplete="username"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined"
                                   fullWidth
                                   required id="email"
                                   label="E-mail"
                                   placeholder="jamesbond@mi6.co.uk"
                                   type="email"
                                   error={emailError}
                                   helperText={emailHelperText}
                                   onChange={validateEmail}
                                   onBlur={validateEmail}
                                   value={email}
                                   autoComplete="email"
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
                                   helperText={passwordHelperText}
                                   onChange={validatePassword}
                                   onBlur={validatePassword}
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
                            startIcon={<PhotoCamera/>}
                        >Picture

                            <Input className={classes.imageInput} type="file" controlled="true" onChange={(input) => {
                                undoGoogleLogin();
                                setImage("loading");
                                let fileReader = new FileReader();
                                let file = input.target.files[0];
                                fileReader.onloadend = () => {
                                    setImageURL(fileReader.result)
                                }
                                setImage(file)
                                fileReader.readAsDataURL(file)

                            }}/>
                            {image === "loading" ? (
                                <>
                                    <CircularProgress size="2ch" className={classes.imageProgress}/>
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
};

export default PersonalInfoForm;