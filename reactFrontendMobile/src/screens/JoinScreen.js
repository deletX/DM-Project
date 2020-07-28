import * as React from 'react';
import {View, Text, StyleSheet, ScrollView, PermissionsAndroid, Alert} from "react-native"
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';


const JoinScreen = (props) => {

    const [paddingTop, setPaddingTop] = React.useState(0);


    const onMapReady = () => {
        Platform.OS === 'android' ? PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ).then(granted => {
            Alert.alert("Permissions", "You already gave GPS permissions") // just to ensure that permissions were granted
            setPaddingTop(1);
        }) : null
    }


    // const getCurrentLocation = () => {
    //     return new Promise((resolve, reject) => {
    //         navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
    //     });
    // };


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
                        latitude: 37.78825,
                        longitude: -122.4324,
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
                            latitude: 37.78825,
                            longitude: -122.4324,
                        }}
                        draggable={true}
                    onDragEnd={(region) => {
                        console.log('onDragEnd', region.nativeEvent)
                    }}>

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