import * as React from 'react';
import {View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity} from "react-native"
import {FAB, Chip, Colors} from "react-native-paper"
import Button from "react-native-paper/src/components/Button";
import EventComponent from "../components/EventComponent";
import moment from "moment";
import {set} from "react-native-reanimated";
import {grey500} from "react-native-paper/src/styles/colors";
import mockEvents from "../components/mockEvents"; //https://momentjs.com/docs/#/displaying/


const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const EventsListScreen = (props) => {
    const eventsList = mockEvents.map((event,) => (
        <EventComponent
            key={event.id}
            event={event}
        >
        </EventComponent>
    ));

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);

    const [joinable, setJoinable] = React.useState(true);
    const [joined, setJoined] = React.useState(true);
    const [owned, setOwned] = React.useState(true);

    return (
        <>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                <View style={styles.chipLayout}>
                    <View style={styles.chip}>
                        <Chip textStyle={styles.chipText}
                              style={{backgroundColor: joinable ? Colors.orange500 : Colors.grey300}}
                              selectedColor="blue"
                              icon={joinable ? "check" : null}
                              onPress={() => setJoinable(!joinable)}> Joinable </Chip>
                    </View>

                    <View style={styles.chip}>
                        <Chip textStyle={styles.chipText}
                              style={{backgroundColor: joined ? Colors.orange500 : Colors.grey300}}
                              selectedColor="blue"
                              icon={joined ? "check" : null}
                              onPress={() => setJoined(!joined)}> Joined </Chip>
                    </View>

                    <View style={styles.chip}>
                        <Chip textStyle={styles.chipText}
                              style={{backgroundColor: owned ? Colors.orange500 : Colors.grey300}}
                              selectedColor="blue"
                              icon={owned ? "check" : null}
                              onPress={() => setOwned(!owned)}> Owned </Chip>
                    </View>
                </View>

                {eventsList}

            </ScrollView>
            <View>
                <FAB style={styles.fab} icon="menu" onPress={props.navigation.toggleDrawer}>
                </FAB>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    chipLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chip: {
        margin: 5,
        marginTop: 15,
        flexWrap: 'wrap'
    },
    chipText: {
        color: Colors.black,
        fontSize: 15
    }
});

export default EventsListScreen;