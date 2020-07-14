import React, {useState} from 'react';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MapContainer from "../../containers/MapContainer";
import {makeStyles} from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import uuid from "node-uuid";
import {connect} from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
    }
}))

const JoinComponent = ({
                           cars, addr, setAddr, pos, setPos, car, setCar
                       }) => {
    const classes = useStyles();


    let carMenuItems = cars.map(car => (
        <MenuItem key={car.id} value={car.id}>{car.name}, {car.tot_avail_seats} seats</MenuItem>
    ))

    carMenuItems.push(<MenuItem key={uuid()} value={-1}>No car</MenuItem>)
    return (
        <div className={classes.root}>
            <FormControl variant={"outlined"} className={classes.form}>
                <InputLabel id="car-label">Car</InputLabel>
                <Select id="car" label="Car" labelId="car-label" value={car}
                        onChange={(input) => {
                            setCar(input.target.value)
                        }}>
                    {carMenuItems}
                </Select>
            </FormControl>
            <MapContainer addr={addr} pos={pos} setAddr={setAddr} setPos={setPos}/>
        </div>

    );
};


function mapStateToProps(state) {
    return {
        cars: state.profile.carSet,
    };
}


export default connect(mapStateToProps)(JoinComponent);