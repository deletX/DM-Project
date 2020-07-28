import React from 'react';
import {Divider, Headline} from "react-native-paper";
import {View} from "react-native";


const EventComputedOtherCarsComponent = (props) => {
    const {profileId, styles} = props
    const event = props.route.params.event

    return (
        <View>
            <Headline style={styles.header}>
                Other Cars
            </Headline>
            <Divider/>
        </View>
    );
};

export default EventComputedOtherCarsComponent;