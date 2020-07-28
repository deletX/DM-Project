import React from 'react';
import {Divider, Headline, Paragraph} from "react-native-paper";
import MapView, {Marker} from "react-native-maps";
import {Linking, Platform, View} from "react-native";
import {pridStringToLatLng} from "../../utils";

const openGps = (lat, lng) => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : `http://www.google.com/maps/place/${lat},${lng}`;
    var url = scheme + `${lat},${lng}`;
    Linking.openURL(url);
}

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
            <MapView
                scrollEnabled={false}
                rotateEnabled={false}
                zoomEnabled={false}
                style={[{width: "100%", height: 300}]}
                initialRegion={{
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{latitude: lat, longitude: lng}}
                    title={event.address}
                    onCalloutPress={() => {
                        openGps(lat, lng)
                    }}
                />
            </MapView>
            <Divider style={{marginTop: 2}}/>
        </>
    );
};

export default EventDescription;