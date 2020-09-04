import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import React from "react";

/**
 * A Grid item (`xs=12`, `sm=6`) wrapping a TextField that is created to handle the consumption of a car.
 *
 * It accepts only numbers (between 1 and 25) with a step of `0.01`.
 */
const CarConsumptionTextInput = (props) => (
    <Grid item xs={12} sm={6}>
        <TextField
            type="number"
            helperText="Between 1 and 25"
            step={0.01}
            label="Consumption"
            value={props.value}
            InputProps={{
                endAdornment: <InputAdornment position="end">l/100Km</InputAdornment>,
                ...props.InputProps
            }}
            onChange={props.onChange}
            onBlur={props.onBlur}

        />
    </Grid>
)

export default CarConsumptionTextInput;