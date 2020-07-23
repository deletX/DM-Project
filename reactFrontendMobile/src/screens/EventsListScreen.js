import * as React from 'react';
import {View, Text} from "react-native"
import Button from "react-native-paper/src/components/Button";

const EventsListScreen = (props) => {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Event list Screen</Text>
            <Button onPress={props.navigation.toggleDrawer}>
                Apri Drawer
            </Button>
        </View>
    );
}

export default EventsListScreen;