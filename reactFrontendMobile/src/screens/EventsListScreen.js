import * as React from 'react';
import {View, Text} from "react-native"
import Button from "react-native-paper/src/components/Button";

const mock_events = [
    {
    "id": 3,
    "name": "blu",
    "picture": "http://192.168.1.8:8000/media/default-event.jpg",
    "description": "blu",
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
    "name": "giallo",
    "picture": "http://192.168.1.8:8000/media/default-event.jpg",
    "description": "giallo",
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
    "name": "verde",
    "picture": "http://192.168.1.8:8000/media/default-event.jpg",
    "description": "ded",
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