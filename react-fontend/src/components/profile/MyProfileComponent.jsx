import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FeedbacksComponent from "../feedback/FeedbacksComponent";
import {TextField} from "@material-ui/core";
import {PhotoCamera} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {changePicture, changeUserData} from "../../actions/profileActions";
import {connect} from "react-redux";
import ProfileComponent from "./ProfileComponent";
import {Helmet} from "react-helmet";
import {useSnackbar} from 'notistack';
import CarsComponent from "./CarsComponent";

/**
 * Component that contains and let change the user profile info:
 * - full name
 * - email
 * - psw (a new one can be set)
 * - image
 *
 * - cars (see {@link CarsComponent}
 */
const MyProfileComponent = (props) => {
    const classes = useStyles();
    const {enqueueSnackbar,} = useSnackbar();
    const {profile, changeUserData, changePicture} = props;

    // to enable edit in the same page
    const [edit, setEdit] = useState(false)

    // data
    const [name, setName] = useState(profile.user.first_name)
    const [surname, setSurname] = useState(profile.user.last_name)
    const [email, setEmail] = useState(profile.user.email)
    const [newPassword, setNewPassword] = useState("")
    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState(profile.picture)

    // errors and helper texts
    const [emailError, setEmailError] = useState(false);
    const [emailHelperText, setEmailHelperText] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordHelperText, setPasswordHelperText] = useState("");

    /**
     * Validates the email through a regular expression
     *
     * @param input from the TextField.
     */
    const validateEmail = (input) => {
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

    /**
     * Validates the password and sets the relative TextField error
     * The password must contain:
     *  - at least a special character between !@#$%^&*
     *  - at least an uppercase
     *  - at least a lowercase
     *  - at least a number
     *
     * @param input
     */
    const validatePassword = (input) => {
        if (input.target.value === null || input.target.value === "") {
            setPasswordError(false);
        } else if (!/^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])[\w!@#$%^&*]{8,}$/.test(input.target.value)) {
            setPasswordError(true);
            setPasswordHelperText("Password should contain at least a lower case, an upper case, a number and a special character [! @ # $ % ^ & *] and be at least 8 characters long and shouldn't contain whitespaces");
        } else {
            setPasswordError(false);
            setPasswordHelperText("");
        }
        setNewPassword(input.target.value)
    };

    return (
        <div className={classes.root}>
            <Helmet>
                <title>DM Project - Your Profile</title>
            </Helmet>
            <ProfileComponent profile={{...profile, picture: imageURL}}/>
            <Grid container spacing={3}>

                <Grid item xs={12} sm={6}>
                    <TextField
                        id="name"
                        label="First Name"
                        required={edit}
                        variant="outlined"
                        value={name}
                        InputProps={{
                            readOnly: !edit,
                        }}
                        onChange={(input) => {
                            setName(input.target.value)
                        }}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        id="surname"
                        label="Last Name"
                        required={edit}
                        InputProps={{
                            readOnly: !edit,
                        }}
                        variant="outlined"
                        value={surname}
                        onChange={(input) => {
                            setSurname(input.target.value)
                        }}
                        fullWidth/>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        required={edit}
                        id="email"
                        label="E-mail"
                        type="email"
                        error={emailError}
                        helperText={emailHelperText}
                        onChange={validateEmail}
                        onBlur={validateEmail}
                        value={email}
                        autoComplete="email"
                        InputProps={{
                            readOnly: !edit,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        id="new-password"
                        label="New password"
                        error={passwordError}
                        value={newPassword}
                        type="password"
                        helperText={passwordHelperText}
                        onChange={validatePassword}
                        InputProps={{
                            readOnly: !edit,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="icon-button-file"
                        type="file"
                        hidden
                        disabled={!edit}
                        onChange={(input) => {
                            let fileReader = new FileReader();
                            let file = input.target.files[0];
                            fileReader.onloadend = () => {
                                setImageURL(fileReader.result)
                            }
                            setImage(file)
                            fileReader.readAsDataURL(file)
                        }}/>
                    <label htmlFor="icon-button-file">
                        <Button
                            disabled={!edit}
                            color="secondary"
                            aria-label="upload picture"
                            variant="contained"
                            component="span"
                            className={classes.changePicButton}
                            startIcon={<PhotoCamera/>}
                        >
                            Change Picture
                        </Button>
                    </label>
                </Grid>

                <Grid item xs={12}>
                    <ButtonGroup
                        variant="contained"
                        className={classes.buttonGroup}>
                        <Button
                            color="secondary"
                            onClick={() => {
                                if (!edit)
                                    setEdit(true)
                                else {
                                    setName(profile.user.first_name)
                                    setSurname(profile.user.last_name)
                                    setEmail(profile.user.email)
                                    setNewPassword("")
                                    setImage(null)
                                    setImageURL(profile.picture)
                                    setEdit(false)
                                }
                            }}>
                            {edit ? "Cancel" : "Edit"}
                        </Button>
                        <Button
                            color="primary"
                            disabled={!edit}
                            onClick={() => {
                                setEdit(false)
                                changeUserData(name, surname, email, newPassword, enqueueSnackbar)
                                if (image !== null)
                                    changePicture(image, enqueueSnackbar)
                            }}>
                            Save
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>

            <div className={classes.element}>
                <Typography variant="h4">
                    Feedback you received
                </Typography>
                {profile.received_feedback.length > 0 ?
                    <FeedbacksComponent
                        feedbacks={profile.received_feedback}
                        edit={false}
                    />
                    :
                    <Typography className={classes.feedbacks}>
                        You haven't received any feedback, yet ;)
                    </Typography>
                }
            </div>

            {profile.given_feedback.length > 0 &&
            <div className={classes.element}>
                <Typography variant="h4">
                    Your given feedbacks
                </Typography>
                <FeedbacksComponent
                    feedbacks={profile.given_feedback}
                    edit={true}/>
            </div>
            }

            <div className={classes.element}>
                <div>
                    <CarsComponent/>
                </div>
            </div>
        </div>
    );
};


const useStyles = makeStyles((theme) => ({
    root: {
        margin: `${theme.spacing(4)}px ${theme.spacing(3)}px ${theme.spacing(4)}px`,
        [theme.breakpoints.down('sm')]: {
            margin: `${theme.spacing(4)}px ${theme.spacing(1)}px ${theme.spacing(4)}px`,
        },
    },
    feedbacks: {
        margin: `${theme.spacing(5)}px ${theme.spacing(8)}px`,
    },
    changePicButton: {
        width: "100%",
        height: "100%",
    },
    buttonGroup: {
        width: "100%",
        "& > *": {
            width: "50%"
        }
    },
    element: {
        marginTop: theme.spacing(3),
    }

}))


function mapDispatchToProps(dispatch) {
    return {
        changeUserData: (firstName, lastName, email, newPassword = "", enqueueSnackbar) =>
            (dispatch(
                changeUserData(firstName, lastName, email,
                    newPassword === "" ? null : newPassword, enqueueSnackbar))),
        changePicture: (image, enqueueSnackbar) => (dispatch(changePicture(image, enqueueSnackbar)))
    };
}

export default connect(
    null, mapDispatchToProps
)(MyProfileComponent);