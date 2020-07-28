import React from 'react';
import _ from "lodash"
import {View, Linking, ScrollView, useWindowDimensions} from "react-native";
import {Divider, Headline, Paragraph, Subheading, Text, Button, Portal, Dialog} from "react-native-paper";
import {pridStringToLatLng} from "../../utils";
import ParticipantListItem from "./ParticipantListItem";
import {useNavigation} from "@react-navigation/native";

const EventComputedYourCarComponent = (props) => {
    const {profileId, styles} = props
    const [visible, setVisible] = React.useState(false)
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const event = props.route.params.event
    const participation = event.participant_set.filter(participation => (participation.profile.id === profileId))
    const myCar = (participation.length > 0 && participation[0].car !== null) ? _.sortBy(event.participant_set.filter((item) => (item.car !== null && item.car.id === participation[0].car.id)), ['pickup_index']) : []
    const expense = participation.length > 0 ? participation[0].expense : 0
    const date = new Date(event.date_time)
    const navigation = useNavigation()
    let directionsURL = ""
    if (participation.length > 0 && participation[0].pickup_index === 0)
        directionsURL = `https://www.google.com/maps/dir/?api=1&origin=${pridStringToLatLng(participation[0].starting_pos, false).join(",")}&destination=${pridStringToLatLng(event.destination, false).join(",")}&travelmode=driving&waypoints=${myCar.map(item => pridStringToLatLng(item.starting_pos, false).join(",")).join("%7C")}`

    const participantsListItems = myCar.map((participant) => (
        <ParticipantListItem key={participant.id} participant={participant} rightIcon={participant.pickup_index === 0}
                             navigation={navigation}/>
    ))
    return (
        <View>
            <Headline style={styles.header}>
                Your Car
            </Headline>
            <Subheading>
                Expenses
            </Subheading>
            <Paragraph>
                {expense}
            </Paragraph>
            {participation[0].pickup_index === 0 &&
            <Button mode="outlined" target="_blank" onPress={() => {
                Linking.openURL(directionsURL)
            }}>
                Directions
            </Button>
            }
            <ScrollView style={{maxHeight: windowHeight * 0.3}}>
                {participantsListItems}
            </ScrollView>
            <Button mode="outlined" /*disabled={(new Date()) < date}*/ onPress={() => {
                setVisible(true)
            }}>
                Submit Feedback
            </Button>
            <Divider/>

            <Portal>
                <Dialog visible={visible} onDismiss={() => {
                    setVisible(false)
                }}>
                    <Dialog.Title>Submit Feedback</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph> We would love to know how your experience was!</Paragraph>

                    </Dialog.Content>

                </Dialog>
            </Portal>
        </View>
    );
};

export default EventComputedYourCarComponent;