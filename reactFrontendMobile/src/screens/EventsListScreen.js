import * as React from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from "react-native"
import {Chip, Colors} from "react-native-paper"
import EventComponent from "../components/event/EventComponent";
import {connect} from 'react-redux';
import {getListEvent} from "../utils/api";
import {handleError} from "../utils/utils";

/**
 * Screen shows all the event got with relative filter selected with Chips ({@link Chip}.
 *
 * This screen also handles reload action
 *
 */
const EventsListScreen = (props) => {
    const [refreshing, setRefreshing] = React.useState(false);

    const [joinable, setJoinable] = React.useState(true);
    const [joined, setJoined] = React.useState(true);
    const [owned, setOwned] = React.useState(false);

    const [events, setEvents] = React.useState([]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getListEvent(joinable, joined, owned, props.token,
            (res) => {
                setEvents(res.data);
                setRefreshing(false);
            },
            (err) => {
                setRefreshing(false);
                handleError("Something went wrong while retrieving the events [017]", err)
            })
    }, [joinable, joined, owned, setEvents, setRefreshing]);

    const reload = (res) => {
        getListEvent(joinable, joined, owned, props.token,
            (res) => {
                setEvents(res.data);
                setRefreshing(false);
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

function mapStateToProps(state) {
    return {
        token: state.auth.token
    };
}

export default connect(
    mapStateToProps,
)(EventsListScreen);
