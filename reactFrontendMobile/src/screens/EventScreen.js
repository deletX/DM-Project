import * as React from 'react';
import {
    ScrollView,
    View,
    ImageBackground,
    useWindowDimensions,
    StyleSheet,
    Image,
    Linking,
    Platform,
} from "react-native"
import {
    Colors,
    Divider,
    Headline,
    IconButton,
    Paragraph,
    Subheading,
    Text,
    Title,
    List, Avatar
} from "react-native-paper"
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from "moment";
import MapView from "react-native-maps";
import {Marker} from 'react-native-maps';
import {pridStringToLatLng} from "../utils";
import CustomAvatar from "../components/CustomAvatar";
import StarRating from 'react-native-star-rating';

const openGps = (lat, lng) => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : `http://www.google.com/maps/place/${lat},${lng}`;
    var url = scheme + `${lat},${lng}`;
    Linking.openURL(url);
}

const RATING_IMAGE = require('../assets/icon.png')

const EventScreen = (props) => {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const event = props.route.params.event
    const scrollViewRef = React.useRef()
    const [lat, lng] = pridStringToLatLng(event.destination)

    const participantsListItems = event.participant_set.map((participant) => (
        <List.Item
            key={participant.id}
            title={`${participant.profile.first_name} ${participant.profile.last_name}`}
            left={(props) => (
                <CustomAvatar picture={participant.profile.picture} firstName={participant.profile.first_name}
                              lastName={participant.profile.last_name}/>)}
            description={(props) => (
                <StarRating
                />
            )}
            right={(props) => (
                <Icon
                    style={{position: "absolute", top: 13, right: 10}}
                    name={participant.car === null ? "directions-walk" : "directions-car"}
                    color={participant.car === null ? Colors.orange700 : Colors.teal500}
                    size={20}
                />
            )}

        />
    ))
    return (
        <ScrollView /*style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}*/ ref={scrollViewRef}>
            <View>
                <ImageBackground source={{uri: event.picture}}
                                 style={[styles.image, {height: windowHeight - 80}]}>
                    <View style={styles.overlay}>
                        <View style={{marginLeft: windowWidth * 0.05}}>
                            <Title style={{color: Colors.white, fontSize: 50, lineHeight: 80}}>{event.name}</Title>
                            <Subheading style={{
                                color: Colors.white,
                                marginTop: windowHeight * 0.3
                            }}>Date: {moment(event.date_time).format("dddd D MMMM YYYY, HH:mm")}</Subheading>
                            <Subheading
                                style={{color: Colors.white, marginTop: 20}}>Destination: {event.address}</Subheading>
                        </View>
                        <View
                            style={{

                                justifyContent: "center",
                                alignitems: "center",
                                flexDirection: "row",
                                position: "absolute",
                                bottom: 10,
                                left: windowWidth / 2 - 30,
                            }}>
                            <IconButton
                                icon="arrow-down-drop-circle-outline"
                                color={Colors.grey200}
                                size={30}
                                onPress={() => {
                                    scrollViewRef.current.scrollTo({x: 0, y: windowHeight, animated: true})
                                }}
                            />
                        </View>
                    </View>
                </ImageBackground>

                <View/>
            </View>
            <View>
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
                <Divider/>
                <Headline style={styles.header}>
                    Participants
                </Headline>
                <ScrollView style={{maxHeight: windowHeight * 0.3}}>
                    {participantsListItems}
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"

    },
    text: {
        color: "grey",
        fontSize: 30,
        fontWeight: "bold"
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.40)',
        flex: 1,
        justifyContent: "center",
    },
    header: {
        marginTop: 10
    }
});

export default EventScreen;