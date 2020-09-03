import React from 'react';
import _ from "lodash";
import ParticipantsContainer from "../../containers/ParticipantsContainer";
import makeStyles from "@material-ui/core/styles/makeStyles";

const OtherCarsParticipation = ({participantSet, profileId}) => {
    const classes = useStyles();

    let participation = participantSet.find((item) => (
        item.profile.id === profileId))
    let cars = participantSet.filter((item) => (
        item.car.id !== participation.car.id))
    cars = Object.values((_.groupBy(cars, (item) => (item.car.id))))

    const carsItems = cars.map((item) => {
        return (
            <div
                key={item.id}
                className={classes.car}>
                <ParticipantsContainer
                    participantSet={_.sortBy(item, ['pickup_index'])}
                    onlyDriverIcon={true}
                />
            </div>)
    })

    return (
        <div className={classes.root}>
            {carsItems}
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {},
    car: {
        marginBottom: theme.spacing(2)
    }
}));

export default OtherCarsParticipation;