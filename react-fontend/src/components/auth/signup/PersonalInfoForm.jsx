import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import AvatarCustom from "../../AvatarCustom";
import {getProfileImage} from "../../../utils/api";
import {handleError, handleSuccess} from "../../../utils/utils";
import {useSnackbar} from 'notistack';
import GoogleLoginButton from "../GoogleLoginButton";
import ImageButton from "../../ImageButton";

const PersonalInfoForm = ({
                              firstName, setFirstName, lastName, setLastName, username, setUsername,
                              usernameError, setUsernameError, password, setPassword, passwordError,
                              setPasswordError, email, setEmail, emailError, setEmailError,
                              image, setImage, imageURL, setImageURL, isGoogleLogin, setGoogleLogin,
                              setGoogleAccessToken, handleNext
                          }) => {
    const classes = useStyles();
    const {enqueueSnackbar,} = useSnackbar();

    const [emailHelperText, setEmailHelperText] = useState("");
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
        if (!/^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])[\w!@#$%^&*]{8,}$/.test(input.target.value)) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
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
                    <GoogleLoginButton
                        onSuccess={(input) => {
                            let username = input.profileObj.email.split("@")[0].replace(' ', '_').replace('.', '_')
                            setGoogleAccessToken(input.accessToken)
                            setGoogleLogin(true)
                            setFirstName(input.profileObj.givenName)
                            setLastName(input.profileObj.familyName)
                            setEmail(input.profileObj.email)
                            setUsername(username)
                            setImageURL(input.profileObj.imageUrl)
                            getProfileImage(input.profileObj.imageUrl,
                                (res) => {
                                    let blob = res.data
                                    let type = res.data.type.split('/').pop()
                                    blob.name = `${username}.${type}`
                                    setImage(blob)
                                    handleSuccess(enqueueSnackbar, "Successfully retrieved profile image")
                                },
                                (err) => {
                                    handleError(enqueueSnackbar, "Could not retrieve profile image", err)
                                })
                            handleNext()
                        }}
                    />

                    {isGoogleLogin &&
                    <Grid item xs={12}>
                        <Alert className={classes.editAlert} severity="warning">Editing these info will undo your
                            Google
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
                                   helperText={"Password should contain at least a lower case, an upper case, " +
                                   "a number and a special character [! @ # $ % ^ & *] and be at least 8 characters " +
                                   "long and shouldn't contain whitespaces"}
                                   onChange={validatePassword}
                                   onBlur={validatePassword}
                                   autoComplete="new-password"
                        />
                    </Grid>

                    <ImageButton
                        onClick={(input) => {
                            undoGoogleLogin();
                            setImage("loading");
                            let fileReader = new FileReader();
                            let file = input.target.files[0];
                            fileReader.onloadend = () => {
                                setImageURL(fileReader.result)
                            }
                            setImage(file)
                            fileReader.readAsDataURL(file)

                        }}
                        loading={image === "loading"}
                    />

                </Grid>
            </form>
        </div>
    )
};

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

export default PersonalInfoForm;