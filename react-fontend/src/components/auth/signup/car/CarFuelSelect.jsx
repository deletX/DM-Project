import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";

/**
 * A Grid item (`xs=12`, `sm=6`) that wraps a form control with a Select that handles the fuel selection.
 *
 * The `value` has already been converted to the numeric representation.
 */
const CarFuelSelect = (props) => (
    <Grid item xs={12} sm={6}>
        <FormControl variant="outlined">
            <InputLabel id="fuel-label">Fuel</InputLabel>
            <Select
                id="fuel"
                labelId="fuel-label"
                label="Fuel"
                value={props.value}
                fullWidth
                onChange={props.onChange}
                inputProps={props.inputProps}>
                <MenuItem value={1}>Petrol</MenuItem>
                <MenuItem value={2}>Diesel</MenuItem>
                <MenuItem value={3}>Gas</MenuItem>
                <MenuItem value={4}>Electric</MenuItem>
            </Select>
        </FormControl>
    </Grid>
)

export default CarFuelSelect;