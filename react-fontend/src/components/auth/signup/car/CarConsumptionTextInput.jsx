import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import React from "react";

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