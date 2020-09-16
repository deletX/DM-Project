import React from 'react';
import {ImageBackground, StyleSheet, useWindowDimensions, View} from "react-native";
import {Button, Colors, IconButton, Subheading, Title} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import {alertAreYouSure, dateFormatter, handleInfo} from "../../utils/utils";
import {HOME_SCREEN} from "../../constants/screens";
import {JOINABLE} from "../../constants/constants";
import {connect} from 'react-redux';
import {deleteEvent, runEvent} from "../../utils/api";

/**
 * Event Title, Date and destination address.
 */
const EventHeaderTitle = (props) => (
    <View style={{marginLeft: props.windowWidth * 0.05}}>
        <Title numberOfLines={3}
               style={[{maxWidth: props.windowWidth * .90}, headerStyles.title]}>
            {props.event.name}
        </Title>
        <Subheading style={{color: Colors.white, marginTop: props.windowHeight * 0.3}}>
            Date: {dateFormatter(props.event.date_time)}
        </Subheading>
        <Subheading style={{color: Colors.white, marginTop: 20}}>
            Destination: {props.event.address}
        </Subheading>
    </View>
)

/**
 * If the user is the owner of the event he may:
 * - **delete** the event,
 * - **run** the event, starting the optimum drivers and pickup sequence computation
 */
const EventHeaderOwnerButtons = (props) => (
    <>
        <Button
            color={Colors.redA700}
            style={headerStyles.deleteButton}
            mode={"contained"}
            icon="delete"
            onPress={alertAreYouSure(
                () => {
                    deleteEvent(props.event.id, props.token,
                        (res) => {
                            props.navigation.navigate(HOME_SCREEN, {refresh: true})
                        })
                })}>
            delete
        </Button>
        <Button
            style={headerStyles.runButton}
            color={Colors.tealA700}
            disabled={(props.event.status !== JOINABLE) || props.expired}
            mode={"contained"}
            icon="play"
            onPress={() => {
                if (!props.minimumCarSeatsCovered) {
                    handleInfo("Not Enough Seats")
                } else {
                    runEvent(props.event.id, props.token,
                        () => {
                            props.navigation.navigate(HOME_SCREEN, {refresh: true})
                        },
                        (err) => {
                        })
                }
            }}>
            run
        </Button>
    </>
)

/**
 * As the web counterpart the event header is put in overlay of the event picture.
 *
 * It gives information about:
 * - title,
 * - date,
 * - destination.
 *
 * Enables the owner to delete or start the computation of the event.
 */
const EventHeaderComponent = (props) => {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const {styles, event} = props
    const isOwner = props.profileId === event.owner.id
    const navigation = useNavigation()

    const drivers = event.participant_set.filter(part => (part.car !== null))
    const availableSeats = drivers.map(item => item.car.tot_avail_seats).reduce((prev, curr) => (prev + curr), 0);
    const minimumCarSeatsCovered = !(availableSeats < event.participant_set.length || event.participant_set.length === 0);


    return (
        <View>
            <ImageBackground source={{uri: event.picture}}
                             style={[styles.image, {height: windowHeight - 80}]}>
                <View style={styles.overlay}>
                    <EventHeaderTitle {...props}
                                      windowWidth={windowWidth}
                                      windowHeight={windowHeight}/>
                    <View style={[{left: windowWidth / 2 - 30}, headerStyles.arrowDown]}>
                        <IconButton icon="arrow-down-drop-circle-outline"
                                    color={Colors.grey200}
                                    size={30}
                                    onPress={() => {
                                        props.scrollViewRef.current.scrollTo({
                                            x: 0,
                                            y: windowHeight - 80,
                                            animated: true
                                        })
                                    }}
                        />
                        {isOwner &&
                        <EventHeaderOwnerButtons {...props}
                                                 navigation={navigation}
                                                 minimumCarSeatsCovered={minimumCarSeatsCovered}/>
                        }
                    </View>
                </View>
            </ImageBackground>
            <View/>
        </View>
    );
};


const headerStyles = StyleSheet.create({
    arrowDown: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
        bottom: 10,
    },
    runButton: {
        position: "absolute",
        top: 10,
        left: 110,
    },
    deleteButton: {
        position: "absolute",
        top: 10,
        right: 90
    },
    title: {
        color: Colors.white,
        fontSize: 50,
        lineHeight: 50,
    }
})

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        profileId: state.profile.id,
    };
}

export default connect(
    mapStateToProps,
)(EventHeaderComponent);