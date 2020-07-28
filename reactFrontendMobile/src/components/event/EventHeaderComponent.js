import React from 'react';
import {ImageBackground, useWindowDimensions, View, Alert, ToastAndroid} from "react-native";
import {Button, Colors, IconButton, Subheading, Title} from "react-native-paper";
import moment from "moment";
import {useNavigation} from "@react-navigation/native";
import axios from "axios"
import {headers} from "../../utils";
import {eventDetailURL, eventRunURL} from "../../constants/apiurls";
import {HOME_SCREEN} from "../../constants/screens";
import {JOINABLE} from "../../constants/constants";

const EventHeaderComponent = (props) => {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const {styles, profileId, token} = props
    const onRefresh = props.route.params.onRefresh
    const event = props.route.params.event
    const isOwner = props.profileId === event.owner.id
    const navigation = useNavigation()

    const checkMinimumCarSeats = () => {
        const drivers = event.participant_set.filter(part => (part.car !== null))
        const availableSeats = drivers.map(item => item.car.tot_avail_seats).reduce((prev, curr) => (prev + curr), 0);
        return !(availableSeats < event.participant_set.length || event.participant_set.length === 0);
    }

    return (
        <View>
            <ImageBackground source={{uri: event.picture}}
                             style={[styles.image, {height: windowHeight - 80}]}>
                <View style={styles.overlay}>
                    <View style={{marginLeft: windowWidth * 0.05}}>
                        <Title numberOfLines={3} style={{
                            color: Colors.white,
                            fontSize: 50,
                            lineHeight: 50,
                            // maxHeight: ,
                            maxWidth: windowWidth * .90
                            // flex: 0,
                        }}>{event.name}</Title>
                        <Subheading style={{
                            color: Colors.white,
                            marginTop: windowHeight * 0.3
                        }}>Date: {moment(event.date_time).format("dddd D MMMM YYYY, HH:mm")}</Subheading>
                        <Subheading
                            style={{
                                color: Colors.white,
                                marginTop: 20
                            }}>Destination: {event.address}</Subheading>
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
                                props.scrollViewRef.current.scrollTo({x: 0, y: windowHeight - 80, animated: true})
                            }}
                        />
                        {isOwner &&
                        <>
                            <Button
                                color={Colors.redA700}
                                disabled={event.status !== JOINABLE}
                                style={{position: "absolute", top: 10, left: -100}}
                                onPress={() => {
                                    Alert.alert(
                                        "Are you sure?",
                                        "It won't be recoverble after you delete it",
                                        [
                                            {
                                                text: "Cancel",
                                            },
                                            {
                                                text: "Yes",
                                                onPress: () => {
                                                    // console.log("yes-delet")
                                                    axios
                                                        .delete(
                                                            eventDetailURL(event.id),
                                                            headers('application/json', token)
                                                        )
                                                        .then(res => {
                                                            ToastAndroid.show("Deleted event", ToastAndroid.SHORT)
                                                            navigation.navigate(HOME_SCREEN, {refresh: true})
                                                        })
                                                        .catch(err => {
                                                            console.log(err)
                                                            ToastAndroid.show("Error while deleting", ToastAndroid.SHORT)
                                                        })
                                                },
                                            }
                                        ]
                                    )
                                }}
                            >
                                delete
                            </Button>

                            <Button
                                style={{position: "absolute", top: 10, left: 80}}
                                color={Colors.tealA700}
                                disabled={event.status !== JOINABLE}
                                onPress={() => {
                                    if (!checkMinimumCarSeats()) {
                                        ToastAndroid.show("Not Enough Seats", ToastAndroid.LONG)
                                    } else {
                                        axios
                                            .get(
                                                eventRunURL(event.id),
                                                headers('application/json', token),
                                            )
                                            .then(res => {
                                                navigation.navigate(HOME_SCREEN, {refresh: true})
                                                ToastAndroid.show("Started", ToastAndroid.SHORT)
                                            })
                                            .catch(err => {
                                                ToastAndroid.show("An error occurred while launching the computation :(", ToastAndroid.LONG)
                                            })
                                    }
                                }}
                            >

                                run
                            </Button>
                        </>
                        }

                    </View>
                </View>
            </ImageBackground>

            <View/>
        </View>
    );
};

export default EventHeaderComponent;