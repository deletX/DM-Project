import * as React from 'react';
import {View, Text} from "react-native"

const EventScreen = (props) => {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Event Screen, id = {props.route.params.id}</Text>
        </View>
    );
}

export default EventScreen;