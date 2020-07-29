import React from 'react';
import {Divider, Headline} from "react-native-paper";
import {View} from "react-native";
import ParticipantListItem from "./ParticipantListItem";
import uuid from "react-native-uuid"
import _ from "lodash"

const EventComputedOtherCarsComponent = (props) => {
    const {profileId, styles} = props
    const event = props.route.params.event
    const participantSet = event.participant_set
    let participation = participantSet.find((item) => (item.profile.id === profileId))
    let cars = participantSet.filter((item) => (item.car.id !== participation.car.id))
    cars = Object.values((_.groupBy(cars, (item) => (item.car.id))))

    const carItems = cars.map((item) => {
        const participants = _.sortBy(item, ['pickup_index'])
        const participantsList = participants.map((participant) => (
            <ParticipantListItem participant={participant} key={participant.id}
                                 rightIcon={participant.pickup_index === 0}/>
        ))
        return (<View key={uuid.v4()} style={{marginTop: 10}}>
            {participantsList}
        </View>)
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

export default EventComputedOtherCarsComponent;