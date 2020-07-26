import * as React from 'react';
import {View, Text, ScrollView, StyleSheet, RefreshControl} from "react-native"
import {FAB} from "react-native-paper"
import Button from "react-native-paper/src/components/Button";
import EventComponent from "../components/EventComponent";
import moment from "moment"; //https://momentjs.com/docs/#/displaying/

const mock_events = [
    {
        "id": 5,
        "name": "black",
        "picture": "http://192.168.1.8:8000/media/event_pictures/greenwaves1_ctDzIww.jpg",
        "description": "this is black description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "address": "Via Pavia 41125 Modena",
        "destination": "SRID=4326;POINT (44.62455358383092 10.93265038854431)",
        "date_time": "2020-07-28T18:45:00+02:00",
        "status": 0,
        "owner": {
            "id": 3,
            "first_name": "Mario",
            "last_name": "Rossi",
            "username": "mario",
            "email": "123@gmail.com",
            "picture": null,
            "average_vote": 5.0
        },
        "participant_set": [{
            "id": 10,
            "profile": {
                "id": 3,
                "first_name": "Mario",
                "last_name": "Rossi",
                "username": "mario",
                "email": "123@gmail.com",
                "picture": null,
                "average_vote": 5.0
            },
            "starting_address": "Ciclabile Modena - Vignola 41125 Modena",
            "starting_pos": "SRID=4326;POINT (44.6282799 10.9341622)",
            "pickup_index": -1,
            "expense": -1.0,
            "car": null
        }]
    },
    {
        "id": 4,
        "name": "pink",
        "picture": "http://192.168.1.8:8000/media/event_pictures/greenwaves1_cvNNZZO.jpg",
        "description": "this is pink description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "address": "Via Francesco Prampolini, 173 41124 Modena",
        "destination": "SRID=4326;POINT (44.6371199 10.928005)",
        "date_time": "2020-07-27T18:44:00+02:00",
        "status": 0,
        "owner": {
            "id": 3,
            "first_name": "Mario",
            "last_name": "Rossi",
            "username": "mario",
            "email": "123@gmail.com",
            "picture": null,
            "average_vote": 5.0
        },
        "participant_set": [{
            "id": 9,
            "profile": {
                "id": 3,
                "first_name": "Mario",
                "last_name": "Rossi",
                "username": "mario",
                "email": "123@gmail.com",
                "picture": null,
                "average_vote": 5.0
            },
            "starting_address": "Via Savona, 68 41125 Modena",
            "starting_pos": "SRID=4326;POINT (44.632181 10.9373846)",
            "pickup_index": -1,
            "expense": -1.0,
            "car": null
        }]
    },
    {
        "id": 3,
        "name": "blu",
        "picture": "http://192.168.1.8:8000/media/default-event.jpg",
        "description": "this is blu description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "address": "Via Emilia Est 41100 Modena",
        "destination": "SRID=4326;POINT (44.62785128423529 10.97045326056342)",
        "date_time": "2020-07-23T11:37:00+02:00",
        "status": 2,
        "owner": {
            "id": 3,
            "first_name": "Mario",
            "last_name": "Rossi",
            "username": "mario",
            "email": "123@gmail.com",
            "picture": null,
            "average_vote": 5.0
        },
        "participant_set": [{
            "id": 8,
            "profile": {
                "id": 2,
                "first_name": "Alberto",
                "last_name": "Vitto",
                "username": "albertovitto16",
                "email": "albertovitto16@gmail.com",
                "picture": "http://192.168.1.8:8000/media/profile_pictures/albertovitto16_t9Yry8U.png",
                "average_vote": 4.5
            },
            "starting_address": "Via Armando Pica, 33 41126 Modena",
            "starting_pos": "SRID=4326;POINT (44.6284815 10.9637086)",
            "pickup_index": 1,
            "expense": 42.0,
            "car": {"id": 2, "name": "car1", "tot_avail_seats": 4, "fuel": 1, "consumption": 10.0}
        }, {
            "id": 7,
            "profile": {
                "id": 3,
                "first_name": "Mario",
                "last_name": "Rossi",
                "username": "mario",
                "email": "123@gmail.com",
                "picture": null,
                "average_vote": 5.0
            },
            "starting_address": "Via Armando Pica, 310 41126 Modena",
            "starting_pos": "SRID=4326;POINT (44.6241547 10.9561546)",
            "pickup_index": 0,
            "expense": 42.0,
            "car": {"id": 2, "name": "car1", "tot_avail_seats": 4, "fuel": 1, "consumption": 10.0}
        }]
    },
    {
        "id": 2,
        "name": "yellow",
        "picture": "http://192.168.1.8:8000/media/default-event.jpg",
        "description": "\"this is yellow description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
        "address": "Via Pioppa 41018 Pioppa Castelfranco Emilia Modena",
        "destination": "SRID=4326;POINT (44.61313524111678 11.03395933398665)",
        "date_time": "2020-07-21T22:12:00+02:00",
        "status": 2,
        "owner": {
            "id": 3,
            "first_name": "Mario",
            "last_name": "Rossi",
            "username": "mario",
            "email": "123@gmail.com",
            "picture": null,
            "average_vote": 5.0
        },
        "participant_set": [{
            "id": 6,
            "profile": {
                "id": 2,
                "first_name": "Alberto",
                "last_name": "Vitto",
                "username": "albertovitto16",
                "email": "albertovitto16@gmail.com",
                "picture": "http://192.168.1.8:8000/media/profile_pictures/albertovitto16_t9Yry8U.png",
                "average_vote": 4.5
            },
            "starting_address": "Via Emilia Est, 1130/2 41126 Modena",
            "starting_pos": "SRID=4326;POINT (44.6283198 10.9683925)",
            "pickup_index": 1,
            "expense": 42.0,
            "car": {"id": 2, "name": "car1", "tot_avail_seats": 4, "fuel": 1, "consumption": 10.0}
        }, {
            "id": 5,
            "profile": {
                "id": 3,
                "first_name": "Mario",
                "last_name": "Rossi",
                "username": "mario",
                "email": "123@gmail.com",
                "picture": null,
                "average_vote": 5.0
            },
            "starting_address": "Strada Del Diamante, 80/1 41126 Modena",
            "starting_pos": "SRID=4326;POINT (44.6279806 10.954603)",
            "pickup_index": 0,
            "expense": 42.0,
            "car": {"id": 2, "name": "car1", "tot_avail_seats": 4, "fuel": 1, "consumption": 10.0}
        }]
    },
    {
        "id": 1,
        "name": "green",
        "picture": "http://192.168.1.8:8000/media/default-event.jpg",
        "description": "\"this is green description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "address": "Via Nuova Estense 41100 Modena",
        "destination": "SRID=4326;POINT (44.62724696467297 10.95166284369309)",
        "date_time": "2020-07-20T19:02:00+02:00",
        "status": 2,
        "owner": {
            "id": 2,
            "first_name": "Alberto",
            "last_name": "Vitto",
            "username": "albertovitto16",
            "email": "albertovitto16@gmail.com",
            "picture": "http://192.168.1.8:8000/media/profile_pictures/albertovitto16_t9Yry8U.png",
            "average_vote": 4.5
        },
        "participant_set": [{
            "id": 2,
            "profile": {
                "id": 3,
                "first_name": "Mario",
                "last_name": "Rossi",
                "username": "mario",
                "email": "123@gmail.com",
                "picture": null,
                "average_vote": 5.0
            },
            "starting_address": "Strada Del Diamante, 80/1 41126 Modena",
            "starting_pos": "SRID=4326;POINT (44.6279806 10.954603)",
            "pickup_index": 1,
            "expense": 42.0,
            "car": {"id": 1, "name": "car", "tot_avail_seats": 4, "fuel": 1, "consumption": 10.0}
        }, {
            "id": 4,
            "profile": {
                "id": 2,
                "first_name": "Alberto",
                "last_name": "Vitto",
                "username": "albertovitto16",
                "email": "albertovitto16@gmail.com",
                "picture": "http://192.168.1.8:8000/media/profile_pictures/albertovitto16_t9Yry8U.png",
                "average_vote": 4.5
            },
            "starting_address": "Via Emilia Est 41100 Modena",
            "starting_pos": "SRID=4326;POINT (44.6264626 10.97293807130186)",
            "pickup_index": 0,
            "expense": 42.0,
            "car": {"id": 1, "name": "car", "tot_avail_seats": 4, "fuel": 1, "consumption": 10.0}
        }]
    }]

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const EventsListScreen = (props) => {
    const eventsList = mock_events.map((event,) => (
        <EventComponent
            key={event.id}
            status={event.status}
            title={event.name}
            date={moment(event.date_time).format("dddd D MMMM YYYY, HH:mm")}
            description={event.description}
            address={event.address}
            picture={event.picture}>
        </EventComponent>
    ));

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);

    return (
        <View style={{flex: 1}}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                {eventsList}
            </ScrollView>
            <View>
                <FAB style={styles.fab} icon="menu" onPress={props.navigation.toggleDrawer}>
                </FAB>
            </View>
        </View>
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
});

export default EventsListScreen;