import React from 'react';
import {Divider, Headline} from "react-native-paper";
import {View} from "react-native";
import ParticipantListItem from "../participant/ParticipantListItem";
import _ from "lodash"
import {connect} from 'react-redux';

/**
 * Shows other cars (**not the one the user is in**)
 *
 * Each car is separated and each participant is represented through {@link ParticipantListItem}
 * and ordered by pickup index.
 *
 * This component is rendered with its title ({@link Headline})
 */
const EventComputedOtherCarsComponent = (props) => {
    const {styles, profileId, event} = props
    const participantSet = event.participant_set

    let participation = participantSet.find((item) => (item.profile.id === profileId))

    let cars = participantSet.filter((item) => (item.car.id !== participation.car.id))
    cars = Object.values((_.groupBy(cars, (item) => (item.car.id))))

    const carItems = cars.map((item) => {
        const participants = _.sortBy(item, ['pickup_index'])

        const participantsList = participants.map((participant) => (
            <ParticipantListItem participant={participant}
                                 key={participant.id}
                                 rightIcon={participant.pickup_index === 0}/>
        ))

        return (
            <View key={item.id}
                  style={{marginTop: 10}}>
                {participantsList}
            </View>
        )
    })

    return (
        <View>
            <Headline style={styles.header}>
                Other Cars
            </Headline>
            {carItems}
            <Divider/>
        </View>
    );
};


function mapStateToProps(state) {
    return {
        profileId: state.profile.id
    };
}


export default connect(
    mapStateToProps,
)(EventComputedOtherCarsComponent);