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
    List,
    Avatar,
    Portal,
    FAB, Button, ActivityIndicator
} from "react-native-paper"
import {connect} from "react-redux"
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from "moment";
import MapView from "react-native-maps";
import {Marker} from 'react-native-maps';
import {pridStringToLatLng} from "../utils";
import CustomAvatar from "../components/CustomAvatar";
import StarRating from 'react-native-star-rating';
import EventHeaderComponent from "../components/event/EventHeaderComponent";
import EventDescription from "../components/event/EventDescription";
import {COMPUTED, COMPUTING, JOINABLE} from "../constants/constants";
import EventParticipantList from "../components/event/EventParticipantList";
import EventComputedYourCarComponent from "../components/event/EventComputedYourCarComponent";
import EventComputedOtherCarsComponent from "../components/event/EventComputedOtherCarsComponent";

const EventScreen = (props) => {

    const event = props.route.params.event

    const scrollViewRef = React.useRef()
    const isOwner = props.profileId === event.owner.id
    const participation = event.participant_set.filter(participation => (participation.profile.id === props.profileId))
    const isParticipating = participation.length > 0
    return (
        <Portal.Host>
            <ScrollView ref={scrollViewRef}>

                <EventHeaderComponent {...props} styles={styles} scrollViewRef={scrollViewRef}/>
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
                    <EventComputedYourCarComponent {...props} styles={styles}/>
                    }

                    {(isOwner && event.status === COMPUTED) &&
                    <EventComputedOtherCarsComponent {...props} styles={styles}/>
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

function mapDispatchToProps(dispatch) {
    return {};
}


export default connect(
    mapStateToProps, mapDispatchToProps()
)(EventScreen);

