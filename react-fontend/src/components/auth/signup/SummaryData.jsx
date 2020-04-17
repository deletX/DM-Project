import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import {defaultProfilePic} from "../../../constants/constants";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {PhotoCamera} from "@material-ui/icons";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import Divider from "@material-ui/core/Divider";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";

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

const SummaryData = ({
                         firstName, lastName, username, password, email,
                         imageURL, carName, totSeats, consumption, fuel,
                         isGoogleLogin
                     }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography className={classes.instruction}>
                Review you're data before submitting!
            </Typography>
            <Avatar src={imageURL !== "" ? imageURL : defaultProfilePic} className={classes.imgPreview}/>

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
                        <TextField fullWidth id="name" label="First Name" value={firstName} InputProps={{
                            readOnly: true,
                        }}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth id="surname" label="Last Name" value={lastName} InputProps={{
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
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="car-name" label="Name"
                                       value={carName}
                                       InputProps={{
                                           readOnly: true,
                                       }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined">
                                <InputLabel id="tot-seats-label">Seats</InputLabel>
                                <Select id="tot-seats" label="Seats" labelId="tot-seats-label" value={totSeats}
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                >
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={9}>9</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined">
                                <InputLabel id="fuel-label">Fuel</InputLabel>
                                <Select id="fuel" labelId="fuel-label" label="Fuel" value={fuel}
                                        inputProps={{
                                            readOnly: true,
                                        }}>
                                    <MenuItem value={1}>Petrol</MenuItem>
                                    <MenuItem value={2}>Diesel</MenuItem>
                                    <MenuItem value={3}>Gas</MenuItem>
                                    <MenuItem value={4}>Electric</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                step={0.05}
                                label="Consumption"
                                value={consumption}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">l/100Km</InputAdornment>,
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                    </Grid>
                </FormControl>
            </>
            }
        </div>
    )
};

export default SummaryData;