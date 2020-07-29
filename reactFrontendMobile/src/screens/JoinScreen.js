import * as React from 'react';
import {View, Text, StyleSheet, ScrollView, PermissionsAndroid, Alert} from "react-native"
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';

const JoinScreen = (props) => {

    const [paddingTop, setPaddingTop] = React.useState(0);
    const [latitude, setLatitude] = React.useState(38.78825);
    const [longitude, setLongitude] = React.useState(-122.4324);


    const onMapReady = () => {
        Platform.OS === 'android' ? PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ).then(granted => {
            // Alert.alert("Permissions", "You already gave GPS permissions") // just to ensure that permissions were granted
            locateCurrentLocation();
            setPaddingTop(1);//trick to show location button
        }) : null
    }


    const locateCurrentLocation = () => {
        Geolocation.getCurrentPosition(position => {
            console.log("your current position ", JSON.stringify(position));
            let region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }
            setLatitude(region.latitude);
            setLongitude(region.longitude);
        })
    }


    return (
        <ScrollView>
            <View style={{
                marginLeft: 15,
                marginRight: 15,
                marginBottom: 15,
                marginTop: 15,
                paddingTop: paddingTop
            }}>
                <MapView
                    onMapReady={() => onMapReady()}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    mapType={"standard"}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    zoomTapEnabled={true}
                    rotateEnabled={true}
                    scrollEnabled={true}
                    onRegionChange={(region) => {
                        //console.log('onRegionChange', region)
                    }}
                    onRegionChangeComplete={(region) => {
                        console.log('onRegionChange', region)
                    }}>
                    <Marker
                        coordinate={{
                            latitude: latitude,
                            longitude: longitude,
                        }}
                        draggable={true}
                        onDragEnd={(region) => {
                            console.log('onDragEnd', region.nativeEvent)
                        }}
                    >


                    </Marker>

                </MapView>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: 500,
    },

});

export default JoinScreen;