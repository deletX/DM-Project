import React from 'react';
import {Divider, Headline, Paragraph} from "react-native-paper";
import MapView, {Marker} from "react-native-maps";
import {Linking, Platform, View} from "react-native";
import {pridStringToLatLng} from "../../utils/utils";

const openGps = (lat, lng) => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : `https://www.google.com/maps/search/?api=1&query=`;
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
                zoomEnabled={true}
                pitchEnabled={false}
                toolbarEnabled={true}
                style={[{width: "100%", height: 300}]}
                camera={{
                    center: {
                        latitude: lat,
                        longitude: lng,
                    },
                    pitch: 0,
                    heading: 0,
                    zoom: 15,
                    altitude: 15,
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