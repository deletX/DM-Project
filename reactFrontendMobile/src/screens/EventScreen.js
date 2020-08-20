import * as React from 'react';
import {ScrollView, StyleSheet, View,} from "react-native"
import {ActivityIndicator, Portal} from "react-native-paper"
import {connect} from "react-redux"
import EventHeaderComponent from "../components/event/EventHeaderComponent";
import EventDescription from "../components/event/EventDescription";
import {COMPUTED, COMPUTING, JOINABLE} from "../constants/constants";
import EventParticipantList from "../components/event/participant/EventParticipantList";
import EventComputedYourCarComponent from "../components/event/computed/EventComputedYourCarComponent";
import EventComputedOtherCarsComponent from "../components/event/computed/EventComputedOtherCarsComponent";

/**
 * Main event Screen. It contains:
 * - the header with image, title and date {@link EventHeaderComponent}
 * - the description {@link EventDescription}
 * - the participant list if the event is not computed yet {@link EventParticipantList}
 * - the car the user has been assigned if the event is computed {@link EventComputedYourCarComponent}
 * - other cars if the user is owner {@link EventComputedOtherCarsComponent}
 */
const EventScreen = (props) => {
    const event = props.route.params.event

    const scrollViewRef = React.useRef()
    const isOwner = props.profileId === event.owner.id
    const participation = event.participant_set.filter(participation => (participation.profile.id === props.profileId))
    const isParticipating = participation.length > 0
    return (
        <Portal.Host>
            <ScrollView ref={scrollViewRef}>
                <EventHeaderComponent event={event} styles={styles} scrollViewRef={scrollViewRef}/>
                <View style={{marginLeft: 15, marginRight: 15, marginBottom: 20}}>
                    <EventDescription event={event} styles={styles}/>
                    {event.status === JOINABLE &&
                    <EventParticipantList event={event} styles={styles}/>
                    }

                    {/*Shouldn't be necessary but who knows*/}
                    {event.status === COMPUTING &&
                    <ActivityIndicator/>
                    }

                    {(event.status === COMPUTED && isParticipating) &&
                    <EventComputedYourCarComponent event={event} styles={styles}/>
                    }

                    {(isOwner && event.status === COMPUTED) &&
                    <EventComputedOtherCarsComponent event={event} styles={styles}/>
                    }
                </View>

            </ScrollView>
        </Portal.Host>
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
        marginTop: 15
    }
});

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        profileId: state.profile.id,
    };
}

export default connect(
    mapStateToProps
)(EventScreen);

