import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {KeyboardDatePicker, KeyboardTimePicker} from "@material-ui/pickers";
import Divider from "@material-ui/core/Divider";
import {connect} from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import uuid from "node-uuid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

const ReviewCreateComponent = ({cars, name, date, description, imageURL, car, address, destination, isStepSkipped}) => {
    const classes = useStyles();

    let carMenuItems = cars.map(car => (
        <MenuItem key={car.id} value={car.id}>{car.name}, {car.tot_avail_seats} seats</MenuItem>
    ))
    carMenuItems.push(<MenuItem key={uuid()} value={-1}>No car</MenuItem>)

    return (
        <div className={classes.root}>
            <Avatar variant="rounded" src={imageURL} className={classes.img}/>

            <form className={classes.form} autoComplete="off">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField variant="outlined" fullWidth id="name" label="Name" placeholder="Awesome Gig"
                                   value={name}
                                   InputProps={{
                                       readOnly: true,
                                   }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <KeyboardDatePicker
                            readOnly
                            fullWidth
                            label="Date"
                            value={date}
                            minDate={new Date()}
                            format="dd/MM/yyyy"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <KeyboardTimePicker
                            readOnly
                            fullWidth
                            label="Time"
                            value={date}
                            ampm={false}
                            InputProps={{
                                readOnly: true,
                            }}
                            mask="__:__"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="description"
                            label="Description"
                            multiline
                            rows={3}
                            rowsMax={10}
                            value={description}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="destination"
                            label="Destination"
                            value={destination}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    {!isStepSkipped(2) &&
                    <>
                        <Grid item xs={12}>
                            <Divider className={classes.divider}/>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant={"outlined"} className={classes.form}>
                                <InputLabel id="car-label">Car</InputLabel>
                                <Select id="car" label="Car" labelId="car-label" value={car}
                                        inputProps={{
                                            readOnly: true,
                                        }}>
                                    {carMenuItems}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="address"
                                label="Address"
                                value={address}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </>
                    }
                </Grid>
            </form>
        </div>
    );
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
    img: {
        color: theme.palette.getContrastText(theme.palette.secondary.dark),
        backgroundColor: theme.palette.secondary.dark,
        margin: 10,
        width: '100%',
        height: '25vw',
        maxHeight: "175px",
    },
    instruction: {
        marginBottom: theme.spacing(2),
    },
    divider: {
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    }

}));

function mapStateToProps(state) {
    return {
        cars: state.profile.carSet,
    };
}

export default connect(mapStateToProps)(ReviewCreateComponent);