import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import CarNameTextField from "./car/CarNameTextField";
import CarTotalSeatsSelect from "./car/CarTotalSeatsSelect";
import CarFuelSelect from "./car/CarFuelSelect";
import CarConsumptionTextInput from "./car/CarConsumptionTextInput";

/**
 * This is a read only form used only for confirmation of the previously entered data for review before submitting
 * (see {@link PersonalInfoForm} and {@link CarForm})
 */
const SummaryData = (props) => {
    const classes = useStyles();
    const {
        firstName, lastName, username, password, email,
        imageURL, carName, totSeats, consumption, fuel,
        isGoogleLogin
    } = props;

    return (
        <div className={classes.root}>
            <Typography className={classes.instruction}>
                Review your data before submitting!
            </Typography>
            <Avatar src={imageURL} className={classes.imgPreview}/>

            <FormControl variant="outlined" className={classes.form}>
                <Grid container spacing={2}>
                    {isGoogleLogin &&
                    <>
                        <Grid item xs={12}>
                            <Alert severity="info">Signing in with Google</Alert>
                        </Grid>
                    </>
                    }
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="name"
                            label="First Name"
                            value={firstName}
                            InputProps={{
                                readOnly: true,
                            }}/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="surname"
                            label="Last Name"
                            value={lastName}
                            InputProps={{
                                readOnly: true,
                            }}/>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="username"
                            label="Username"
                            value={username}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="email"
                            label="E-mail"
                            type="email"
                            value={email}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    {!isGoogleLogin &&
                    <>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="password"
                                label="Password"
                                value={password}
                                type="password"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </>
                    }
                </Grid>
            </FormControl>

            {carName !== "" &&
            <>
                <Divider className={classes.carDivider}/>
                <FormControl variant="outlined" className={classes.form}>
                    <Grid container spacing={2}>
                        <CarNameTextField value={carName} InputProps={{readOnly: true}}/>

                        <CarTotalSeatsSelect value={totSeats} inputProps={{readOnly: true}}/>

                        <CarFuelSelect value={fuel} inputProps={{readOnly: true}}/>

                        <CarConsumptionTextInput value={consumption} InputProps={{readOnly: true}}/>
                    </Grid>
                </FormControl>
            </>
            }
        </div>
    )
};

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(5),
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
    instruction: {
        marginBottom: theme.spacing(2),
    },
    carDivider: {
        width: '123%',
        marginTop: theme.spacing(5),
        marginRight: '22px',
        marginBottom: theme.spacing(5),
    }

}));


export default SummaryData;