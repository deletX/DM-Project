import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

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

}));

const CarForm = ({
                     name, setName, totSeats, setTotSeats,
                     consumption, setConsumption,
                     fuel, setFuel,
                 }) => {
    const classes = useStyles();
    let [nameError, setNameError] = useState(false)

    return (
        <div className={classes.root}>
            <FormControl variant="outlined" className={classes.form}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth id="car-name" label="Name" placeholder="Fiat Uno 1992"
                                   value={name}
                                   onChange={(input) => {
                                       let name = input.target.value;
                                       if (name.length > 0) {
                                           setNameError(false)
                                       } else {
                                           setNameError(true)
                                       }
                                       setName(name);
                                   }}
                                   onBlur={(input) => {
                                       if (input.target.value.length < 0 || input.target.value === "") {
                                           setNameError(true)
                                       }
                                   }}
                                   error={nameError}
                                   required
                                   helperText={nameError ? "Required" : ""}
                                   autoComplete="name"/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined">
                            <InputLabel id="tot-seats-label">Seats</InputLabel>
                            <Select id="tot-seats" label="Seats" labelId="tot-seats-label" value={totSeats}
                                    onChange={(input) => {
                                        setTotSeats(input.target.value)
                                    }}>
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
                                    onChange={(input) => {
                                        setFuel(input.target.value)
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
                            helperText="Between 1 and 25"
                            step={0.01}
                            label="Consumption"
                            value={consumption}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">l/100Km</InputAdornment>,
                            }}
                            onChange={(input) => {
                                setConsumption(input.target.value)
                            }}
                            onBlur={(input) => {
                                let val = input.target.value
                                if (val < 1)
                                    input.target.value = 1;
                                if (val > 20)
                                    input.target.value = 20;
                                setConsumption(input.target.value)
                            }}

                        />
                    </Grid>

                </Grid>
            </FormControl>
        </div>
    )
};

export default CarForm;