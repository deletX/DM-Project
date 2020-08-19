import * as React from 'react';
import {View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity} from "react-native"
import {FAB, Chip, Colors} from "react-native-paper"
import Button from "react-native-paper/src/components/Button";
import EventComponent from "../components/event/EventComponent";
import moment from "moment";
import {set} from "react-native-reanimated";
import {grey500} from "react-native-paper/src/styles/colors";
import {JOINABLE} from "../constants/constants";
import axios from "axios";


const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const EventsListScreen = (props) => {
    const [refreshing, setRefreshing] = React.useState(false);

    const [joinable, setJoinable] = React.useState(true);
    const [joined, setJoined] = React.useState(true);
    const [owned, setOwned] = React.useState(false);

    const [events, setEvents] = React.useState([]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        console.log(joinable, joined, owned)
        axios
            .get(eventListURL(joinable, joined, owned), headers('application/json', props.token))
            .then((response) => {
                setEvents(response.data);
                setRefreshing(false);
            })
            .catch((err) => {
                //TODO: toast
                setRefreshing(false);
            });
    }, [joinable, joined, owned, setEvents, setRefreshing]);

    const reload = (res) => {
        axios
            .get(eventListURL(joinable, joined, owned), headers('application/json', props.token))
            .then((response) => {
                setEvents(response.data)
            })
            .catch((err) => {
                //toast
            })
    }
    React.useEffect(() => {
        reload();

        if (props.route.params?.refresh) {
            reload();
        }
    }, [joinable, joined, owned, props.route.params?.refresh]);

    const eventsList = events.map((event,) => (
        <EventComponent
            key={event.id}
            event={event}
            reload={reload}
        >
        </EventComponent>
    ));


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
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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


import {connect} from 'react-redux';
import {eventListURL} from "../constants/apiurls";
import {headers} from "../utils/utils";

function mapStateToProps(state) {
    return {
        token: state.auth.token
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
)(EventsListScreen);
