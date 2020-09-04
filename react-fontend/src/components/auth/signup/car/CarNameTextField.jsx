import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import React from "react";

/**
 * A Grid item (`xs=12`, `sm=6`) that wraps a TextField that has the pre-set id, label and placeholder for the car name
 */
const CarNameTextField = (props) => (
    <Grid item xs={12} sm={6}>
        <TextField
            fullWidth id="car-name"
            label="Name"
            placeholder="Fiat Uno 1992"
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            error={props.error}
            required
            helperText={props.helperText}
            autoComplete="name"
            InputProps={props.InputProps}
        />
    </Grid>
)
export default CarNameTextField