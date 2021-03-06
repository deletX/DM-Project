import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MapContainer from "../../containers/MapContainer";
import {makeStyles} from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import {connect} from "react-redux";

/**
 * Component that contains the form to insert data required to join an event:
 * - Car (Select)
 * - Position with {@link MapContainer}
 */
const JoinComponent = (props) => {
    const classes = useStyles();
    const {cars, addr, setAddr, pos, setPos, car, setCar} = props;

    let carMenuItems = cars.map(car => (
        <MenuItem
            key={car.id}
            value={car.id}>
            {car.name}, {car.tot_avail_seats} seats
        </MenuItem>
    ))
    carMenuItems.push(
        <MenuItem
            key={-1}
            value={-1}>
            No car
        </MenuItem>)

    return (
        <div className={classes.root}>
            <FormControl variant={"outlined"} className={classes.form}>
                <InputLabel id="car-label">
                    Car
                </InputLabel>
                <Select
                    id="car"
                    label="Car"
                    labelId="car-label"
                    value={car}
                    onChange={(input) => {
                        setCar(input.target.value)
                    }}>
                    {carMenuItems}
                </Select>
            </FormControl>
            <MapContainer
                addr={addr}
                pos={pos}
                setAddr={setAddr}
                setPos={setPos}/>
        </div>

    );
};

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

function mapStateToProps(state) {
    return {
        cars: state.profile.carSet,
    };
}


export default connect(mapStateToProps)(JoinComponent);