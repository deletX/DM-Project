import * as React from 'react';
import {View, Text, StyleSheet, ScrollView, PermissionsAndroid} from "react-native"
import MapView, {Polyline, PROVIDER_GOOGLE} from 'react-native-maps';


const JoinScreen = (props) => {

    const [paddingTop, setPaddingTop] = React.useState(0);


    const onMapReady = () => {
        Platform.OS === 'android' ? PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ).then(granted => {
            alert("allowed") // just to ensure that permissions were granted
            setPaddingTop(1);
        }) : null
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
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    mapType={"standard"}
                    showsUserLocation={true}
                    showsMyLocationButton={true}

                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
        marginTop: 15
    },
    map: {
        width: "100%",
        height: 500,
    },

});

export default JoinScreen;