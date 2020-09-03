import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";

const CarTotalSeatsSelect = (props) => (
    <Grid item xs={12} sm={6}>
        <FormControl variant="outlined">
            <InputLabel id="tot-seats-label">
                Seats
            </InputLabel>
            <Select
                id="tot-seats"
                label="Seats"
                labelId="tot-seats-label"
                value={props.value}
                onChange={props.onChange}
                inputProps={props.inputProps}
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
)

export default CarTotalSeatsSelect