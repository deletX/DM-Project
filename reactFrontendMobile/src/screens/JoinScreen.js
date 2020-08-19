import * as React from 'react';
import {View, Text, StyleSheet, ScrollView, PermissionsAndroid, Alert} from "react-native";
import {TextInput, Button, Title, Headline, Colors, Dialog, Portal, Paragraph, RadioButton} from 'react-native-paper';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import {Dropdown} from 'react-native-material-dropdown-v2';
import {Picker} from '@react-native-community/picker';
import axios from "axios";
import {eventJoinURL} from "../constants/apiurls"
import {LogBox} from 'react-native';
import {nominatimCoordinatesToAddressURL} from "../constants/apiurls";
import {headers, selectItem} from "../utils/utils";
import {useNavigation} from "@react-navigation/native";

LogBox.ignoreLogs(['Warning: useNativeDriver']);
LogBox.ignoreLogs(['Warning: componentWillReceiveProps']);

const JoinScreen = (props) => {

    const navigation = useNavigation()

    const initialLatitude = 44.64435687822052, initialLongitude = 10.937380660325289; //Modena

    const [paddingTop, setPaddingTop] = React.useState(0);

    const [latitude, setLatitude] = React.useState(initialLatitude);
    const [longitude, setLongitude] = React.useState(initialLongitude);

    const [GPSPositionLatitude, setGPSPositionLatitude] = React.useState(undefined);
    const [GPSPositionLongitude, setGPSPositionLongitude] = React.useState(undefined);

    const [MarkerPositionLatitude, setMarkerPositionLatitude] = React.useState(initialLatitude);
    const [MarkerPositionLongitude, setMarkerPositionLongitude] = React.useState(initialLongitude);

    const [car, setCar] = React.useState("no car");//name of the selected car, default no car
    const carsRadioItem = props.cars.map((car, key) => (
        <RadioButton.Item label={car.name} value={car.name} key={key}/>)
    );
    carsRadioItem.unshift(<RadioButton.Item label={"no car"} value={"no car"} key={"-1"}/>);
    let carsID = Object.assign({}, ...props.cars.map((x) => ({[x.name]: x.id})));//id of a car given the name
    carsID["no car"] = null;

    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

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
            console.log("Your current position: ", JSON.stringify(position));
            let region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }
            setGPSPositionLatitude(region.latitude);
            setGPSPositionLongitude(region.longitude);

            setMarkerPositionLatitude(region.latitude);
            setMarkerPositionLongitude(region.longitude);

            setLatitude(region.latitude);
            setLongitude(region.longitude);
        }, (error) => {
            console.log("Error in locateCurrentLocation ", error);
        })
    }

    const joinWithGPS = async () => {
        let payload = await getNominatimInfo(GPSPositionLatitude, GPSPositionLongitude);
        await postJoinedEvent(props.route.params.id, props.token, payload[0], payload[1], carsID[car], navigation);
    }

    const joinWithMarker = async () => {
        let payload = await getNominatimInfo(MarkerPositionLatitude, MarkerPositionLongitude);
        await postJoinedEvent(props.route.params.id, props.token, payload[0], payload[1], carsID[car], navigation);
    }

    return (
        <ScrollView keyboardShouldPersistTaps={"always"}>

            <View style={{
                marginLeft: 30, marginRight: 30, marginBottom: 15, marginTop: 15, paddingTop: paddingTop
            }}>
                <Headline style={styles.headline}>
                    Car
                </Headline>

                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Select car</Dialog.Title>
                        <Dialog.Content>
                            <RadioButton.Group onValueChange={car => setCar(car)} value={car}>
                                {carsRadioItem}
                            </RadioButton.Group>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Done</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <TextInput style={{fontSize: 20, marginBottom: 15, marginTop: 15}} flat disabled={true}
                           label={"Selected car"} value={car}
                           mode={"flat"}/>
                <Button mode="outlined" icon={"car-hatchback"} onPress={showDialog} style={{marginBottom: 15}}>Pick
                    car</Button>
                <Headline style={styles.headline}>
                    Select your pick up location!
                </Headline>
                <MapView
                    onMapReady={() => onMapReady()}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={{
                        latitude: MarkerPositionLatitude,
                        longitude: MarkerPositionLongitude,
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
                        console.log('onRegionChangeComplete', region);
                    }}
                    onLongPress={(region) => {
                        setMarkerPositionLatitude(region.nativeEvent["coordinate"].latitude);
                        setMarkerPositionLongitude(region.nativeEvent["coordinate"].longitude);
                    }}

                >
                    <Marker
                        coordinate={{
                            latitude: MarkerPositionLatitude,
                            longitude: MarkerPositionLongitude,
                        }}
                        draggable={true}
                        onDragEnd={(region) => {
                            console.log('onDragEnd', region.nativeEvent);
                            setMarkerPositionLatitude(region.nativeEvent["coordinate"].latitude);
                            setMarkerPositionLongitude(region.nativeEvent["coordinate"].longitude);
                        }}
                    >

                    </Marker>

                </MapView>

                <View style={styles.buttonsContainer}>
                    <Button style={styles.button} mode={"text"} color={Colors.deepOrange900} icon="crosshairs-gps"
                            onPress={joinWithGPS}> Join </Button>
                    <Button style={styles.button} mode={"text"} color={Colors.deepOrange900} icon="map-marker"
                            onPress={joinWithMarker}> Join </Button>


                </View>
                {/*    <Text>{"GPS current latitude: "}{GPSPositionLatitude}</Text>*/}
                {/*    <Text>{"GPS current longitude: "}{GPSPositionLongitude}</Text>*/}
                {/*</View>*/}
                {/*<View>*/}
                {/*    <Text>{"Marker current latitude: "}{MarkerPositionLatitude}</Text>*/}
                {/*    <Text>{"Marker current longitude: "}{MarkerPositionLongitude}</Text>*/}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: 500,
    },
    headline: {
        fontSize: 30,
        marginBottom: 15
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        marginTop: 15
    }

});

import {connect} from 'react-redux';
import {getNominatimInfo, postJoinedEvent} from "../utils/api";

function mapStateToProps(state) {
    return {
        cars: state.profile.carSet,
        token: state.auth.token,
    };
}

export default connect(
    mapStateToProps,
)(JoinScreen);
