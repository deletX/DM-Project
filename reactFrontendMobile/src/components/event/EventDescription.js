import React from 'react';
import {Divider, Headline, Paragraph} from "react-native-paper";
import MapView, {Marker} from "react-native-maps";
import {Linking, Platform, View} from "react-native";
import {pridStringToLatLng} from "../../utils/utils";

/**
 * Creates and opens a deep link to open maps either on iOS as well as android
 *
 * @param {string|number} lat
 * @param {string|number} lng
 */
const openGps = (lat, lng) => {
    const scheme = Platform.OS === 'ios' ? 'maps:' : `geo:`;
    const url = scheme + `${lat},${lng}`;
    Linking.openURL(url);
}

/**
 * Map of the Event with a Marker on the destinaiton location that on click open maps
 */
const EventMap = (props) => (
    <MapView
        scrollEnabled={false}
        rotateEnabled={false}
        zoomEnabled={true}
        pitchEnabled={false}
        toolbarEnabled={true}
        style={[{width: "100%", height: 300}]}
        camera={{
            center: {
                latitude: props.lat,
                longitude: props.lng,
            },
            pitch: 0,
            heading: 0,
            zoom: 15,
            altitude: 15,
        }}
    >
        <Marker
            coordinate={{latitude: props.lat, longitude: props.lng}}
            title={props.event.address}
            onCalloutPress={() => {
                openGps(props.lat, props.lng)
            }}
        />
    </MapView>
)

/**
 * Eevent description and map {@link EventMap}
 */
const EventDescription = (props) => {
    const {styles, event} = props
    const [lat, lng] = pridStringToLatLng(event.destination)

    return (
        <>
            <Headline style={styles.header}>
                Description
            </Headline>
            <Paragraph>
                {event.description}
            </Paragraph>
            <Divider/>
            <Headline style={styles.header}>
                Destination
            </Headline>
            <EventMap {...props} lat={lat} lng={lng}/>
            <Divider style={{marginTop: 2}}/>
        </>
    );
};

export default EventDescription;