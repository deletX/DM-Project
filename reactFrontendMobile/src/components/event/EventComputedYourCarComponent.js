import React from 'react';
import {View} from "react-native";
import {Divider, Headline, Text} from "react-native-paper";

const EventComputedYourCarComponent = (props) => {
    const {profileId, styles} = props
    const event = props.route.params.event
    return (
        <View>
            <Headline style={styles.header}>
                Your Car
            </Headline>
            <Divider/>
        </View>
    );
};

export default EventComputedYourCarComponent;