import * as React from 'react';
import {LogBox, PermissionsAndroid, ScrollView, StyleSheet, View} from "react-native";
import {Button, Caption, Colors, Dialog, Headline, Portal, RadioButton, TextInput} from 'react-native-paper';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from "@react-navigation/native";
import {connect} from 'react-redux';
import {getNominatimInfo, postJoinedEvent} from "../utils/api";
import {HOME_SCREEN} from "../constants/screens";
import {handleError} from "../utils/utils";

LogBox.ignoreLogs(['Warning: useNativeDriver']);
LogBox.ignoreLogs(['Warning: componentWillReceiveProps']);

/**
 * Choose car Dialog, with Radio Buttons
 */
const ChooseCarDialog = (props) => (
    <Portal>
        <Dialog visible={props.visible} onDismiss={props.onDismiss}>
            <Dialog.Title>Select car</Dialog.Title>
            <Dialog.Content>
                <RadioButton.Group onValueChange={props.onValueChange} value={props.value}>
                    {props.children}
                </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={props.onPress}>Done</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
)

/**
 * Map to select pickup location. Has a draggable marker
 */
const PickupMap = (props) => (
    <MapView
        onMapReady={props.onMapReady}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={props.region}
        mapType={"standard"}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomTapEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}>
        <Marker
            coordinate={props.markerCoordinate}
            draggable
            onDragEnd={props.markerOnDragEnd}>
        </Marker>
    </MapView>
)

/**
 * Join screen include Car selection {@link ChooseCarDialog}
 * And map with draggable marker to select pickup position. {@link PickupMap}
 *
 * It is possible to join either with the marker (automatically placed on user location if available) or on the user
 * position, ignoring the marker position.
 */
const JoinScreen = (props) => {
    const navigation = useNavigation()

    const [paddingTop, setPaddingTop] = React.useState(0);

    const [GPSPositionLatitude, setGPSPositionLatitude] = React.useState(undefined);
    const [GPSPositionLongitude, setGPSPositionLongitude] = React.useState(undefined);

    const [MarkerPositionLatitude, setMarkerPositionLatitude] = React.useState(44.64435687822052); //Modena
    const [MarkerPositionLongitude, setMarkerPositionLongitude] = React.useState(10.937380660325289); //Modena


    const [car, setCar] = React.useState("no car"); //name of the selected car, default no car
    const carsRadioItem = props.cars.map((car, key) => (
            <RadioButton.Item label={car.name}
                              value={car.name}
                              key={key}/>
        )
    );
    carsRadioItem.unshift(
        <RadioButton.Item label={"no car"}
                          value={"no car"}
                          key={"-1"}/>
    );
    let carsID = Object.assign({}, ...props.cars.map((x) => ({[x.name]: x.id}))); //id of a car given the name
    carsID["no car"] = null;

    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    /**
     * When map is ready if got permission to access fine location set it
     */
    const onMapReady = () => {
        Platform.OS === 'android' ? PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ).then(granted => {
            locateCurrentLocation();
            setPaddingTop(1);//trick to show location button
        }) : null
    }

    /**
     * Get current location and set it for the map
     */
    const locateCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
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

            }, (error) => {
                handleError("Something went wrong with your location [018]", error)
            })
    }

    /**
     * get address from GPS position and join the event
     */
    const joinWithGPS = async () => {
        let payload = await getNominatimInfo(GPSPositionLatitude, GPSPositionLongitude);
        await postJoinedEvent(props.route.params.id, props.token,
            payload[0], payload[1], carsID[car],
            (res) => {
                navigation.navigate(HOME_SCREEN, {refresh: true})
            },
            (err) => {
            });
    }

    /**
     * get address from marker position and join the event
     */
    const joinWithMarker = async () => {
        let payload = await getNominatimInfo(MarkerPositionLatitude, MarkerPositionLongitude);
        await postJoinedEvent(props.route.params.id, props.token,
            payload[0], payload[1], carsID[car],
            (res) => {
                navigation.navigate(HOME_SCREEN, {refresh: true})
            },
            (err) => {
            });
    }

    return (
        <ScrollView keyboardShouldPersistTaps={"always"}>
            <View style={[{paddingTop: paddingTop}, styles.view]}>

                <Headline style={styles.headline}>
                    Car
                </Headline>
                <ChooseCarDialog visible={visible}
                                 onDismiss={hideDialog}
                                 onValueChange={car => setCar(car)} value={car}
                                 onPress={hideDialog}>
                    {carsRadioItem}
                </ChooseCarDialog>
                <TextInput style={styles.textInput} flat disabled={true}
                           label={"Selected car"} value={car}
                           mode={"flat"}/>
                <Button mode="outlined" icon={"car-hatchback"}
                        onPress={showDialog}
                        style={{marginBottom: 15}}>
                    Pick car
                </Button>

                <Headline style={styles.headline}>
                    Select your pick up location!
                </Headline>
                <Caption>You can hold the marker and move it around</Caption>

                <PickupMap
                    onMapReady={() => onMapReady()}
                    region={{
                        latitude: MarkerPositionLatitude,
                        longitude: MarkerPositionLongitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    markerCoordinate={{
                        latitude: MarkerPositionLatitude,
                        longitude: MarkerPositionLongitude,
                    }}
                    markerOnDragEnd={(region) => {
                        setMarkerPositionLatitude(region.nativeEvent["coordinate"].latitude);
                        setMarkerPositionLongitude(region.nativeEvent["coordinate"].longitude);
                    }}
                />

                <View style={styles.buttonsContainer}>
                    <Button style={styles.button}
                            mode={"text"}
                            color={Colors.deepOrange900}
                            icon="crosshairs-gps"
                            onPress={joinWithGPS}>
                        Join
                    </Button>
                    <Button style={styles.button}
                            mode={"text"}
                            color={Colors.deepOrange900}
                            icon="map-marker"
                            onPress={joinWithMarker}>
                        Join
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    view: {
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 15,
        marginTop: 15
    },
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
    },
    textInput: {
        fontSize: 20,
        marginBottom: 15,
        marginTop: 15
    }

});

function mapStateToProps(state) {
    return {
        cars: state.profile.carSet,
        token: state.auth.token,
    };
}

export default connect(
    mapStateToProps,
)(JoinScreen);
