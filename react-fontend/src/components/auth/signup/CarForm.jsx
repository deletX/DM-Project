import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import CarTotalSeatsSelect from "./car/CarTotalSeatsSelect";
import CarFuelSelect from "./car/CarFuelSelect";
import CarConsumptionTextInput from "./car/CarConsumptionTextInput";
import CarNameTextField from "./car/CarNameTextField";

/**
 * Form component to insert car data:
 *  - name {@link CarNameTextField}
 *  - total seats {@link CarTotalSeatsSelect}
 *  - fuel {@link CarFuelSelect}
 *  - consumption {@link CarConsumptionTextInput}
 */
const CarForm = (props) => {
    const classes = useStyles();
    const {
        name, setName, totSeats, setTotSeats,
        consumption, setConsumption,
        fuel, setFuel,
    } = props;

    let [nameError, setNameError] = useState(false)

    return (
        <div className={classes.root}>
            <FormControl variant="outlined" className={classes.form}>
                <Grid container spacing={2}>
                    <CarNameTextField
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
                        helperText={nameError ? "Required" : ""}
                    />

                    <CarTotalSeatsSelect
                        value={totSeats}
                        onChange={(input) => {
                            setTotSeats(input.target.value)
                        }}/>

                    <CarFuelSelect
                        value={fuel}
                        onChange={(input) => {
                            setFuel(input.target.value)
                        }}
                    />

                    <CarConsumptionTextInput
                        value={consumption}
                        onChange={(input) => {
                            setConsumption(input.target.value)
                        }}
                        onBlur={(input) => {
                            let val = input.target.value

                            // value has to be between 1 and 25
                            if (val < 1)
                                input.target.value = 1;
                            if (val > 25)
                                input.target.value = 25;
                            setConsumption(input.target.value)
                        }}
                    />
                </Grid>
            </FormControl>
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

}));

export default CarForm;