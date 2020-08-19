import React from 'react';
import _ from "lodash"
import {Linking, ScrollView, useWindowDimensions, View} from "react-native";
import {Button, Divider, Headline, Portal, RadioButton, Subheading} from "react-native-paper";
import {createDirectionLink} from "../../../utils/utils";
import ParticipantListItem from "../participant/ParticipantListItem";
import {useNavigation} from "@react-navigation/native";
import FeedbackDialog from "../../feedback/FeedbackDialog";
import {connect} from 'react-redux';

/**
 *
 */
const EventComputedYourCarComponent = (props) => {
    const {profileId, styles, event} = props
    const [visible, setVisible] = React.useState(false)

    const windowHeight = useWindowDimensions().height;
    const participation = event.participant_set.filter(participation => (participation.profile.id === profileId))
    const myCar = participation.length > 0 ? _.sortBy(event.participant_set.filter((item) => (item.car !== null && item.car.id === participation[0].car.id)), ['pickup_index']) : []
    const expense = participation[0].expense
    const date = new Date(event.date_time)
    const navigation = useNavigation()
    let directionsURL = ""
    const isDriver = participation[0].pickup_index === 0

    if (isDriver)
        directionsURL = createDirectionLink(participation[0], event, myCar)


    const participantsListItems = myCar.map((participant) => {
        return (
            <View key={participant.id}>
                <ParticipantListItem participant={participant}
                                     rightIcon={participant.pickup_index === 0}
                                     navigation={navigation}/>
                {participant.pickup_index === 0 &&
                <Divider/>
                }
            </View>)
    })

    const feedbackMenuItems = myCar.length === 0 ? [] : myCar.filter((participant) => (participant.profile.id !== profileId)).map(item => (
        <RadioButton.Item key={item.id} label={`${item.profile.first_name} ${item.profile.last_name}`}
                          value={item.profile.id} style={{height: 40}}/>
    ))

    return (
        <View>
            <Headline style={styles.header}>
                Your Car
            </Headline>

            <Subheading style={{marginBottom: 10}}>
                Expenses {expense}€
            </Subheading>

            {isDriver &&
            <Button style={{marginBottom: 10}} mode="outlined" target="_blank" onPress={() => {
                Linking.openURL(directionsURL)
            }}>
                Directions
            </Button>
            }
            <ScrollView style={{maxHeight: windowHeight * 0.3, marginBottom: 15}}>
                {participantsListItems}
            </ScrollView>
            <Button style={{marginBottom: 10}} mode="outlined"
                    disabled={feedbackMenuItems.length === 0 || (new Date()) < date}
                    onPress={() => {
                        setVisible(true)
                    }}>
                Submit Feedback
            </Button>
            <Divider/>
            <Portal>
                <FeedbackDialog car={myCar} event={event} visible={visible} onDismiss={() => setVisible(false)}
                                feedbackMenuItems={feedbackMenuItems}/>
            </Portal>
        </View>
    );
};

function mapStateToProps(state) {
    return {
        profileId: state.profile.id,

    };
}

export default connect(
    mapStateToProps,
)(EventComputedYourCarComponent);