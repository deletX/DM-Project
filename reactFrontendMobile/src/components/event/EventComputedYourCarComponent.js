import React from 'react';
import _ from "lodash"
import {View, Linking, ScrollView, useWindowDimensions, ToastAndroid} from "react-native";
import {
    Divider,
    Headline,
    Paragraph,
    Subheading,
    Text,
    Button,
    Portal,
    Dialog,
    RadioButton,
    TextInput, Caption
} from "react-native-paper";
import {headers, pridStringToLatLng} from "../../utils";
import ParticipantListItem from "./ParticipantListItem";
import {useNavigation} from "@react-navigation/native";
import StarRating from "react-native-star-rating";
import axios from "axios";
import {createFeedbackURL} from "../../constants/apiurls";


const EventComputedYourCarComponent = (props) => {
    const {profileId, styles, token} = props
    const [visible, setVisible] = React.useState(false)


    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const event = props.route.params.event
    const participation = event.participant_set.filter(participation => (participation.profile.id === profileId))
    const myCar = _.sortBy(event.participant_set.filter((item) => (item.car !== null && item.car.id === participation[0].car.id)), ['pickup_index'])
    const expense = participation[0].expense
    const date = new Date(event.date_time)
    const navigation = useNavigation()
    let directionsURL = ""
    if (participation[0].pickup_index === 0)
        directionsURL = `https://www.google.com/maps/dir/?api=1&origin=${pridStringToLatLng(participation[0].starting_pos, false).join(",")}&destination=${pridStringToLatLng(event.destination, false).join(",")}&travelmode=driving&waypoints=${myCar.map(item => pridStringToLatLng(item.starting_pos, false).join(",")).join("%7C")}`

    const [comment, setComment] = React.useState("")
    const [vote, setVote] = React.useState(3)
    const [receiver, setReceiver] = React.useState(myCar[0].profile.id)

    const participantsListItems = myCar.map((participant) => (
        <ParticipantListItem key={participant.id} participant={participant} rightIcon={participant.pickup_index === 0}
                             navigation={navigation}/>
    ))

    const feedbackMenuItems = myCar.length === 0 ? [] : myCar.map(item => (
        <View key={item.id} style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <Text>{item.profile.first_name} {item.profile.last_name}</Text>
            <RadioButton value={item.profile.id}/>
        </View>
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
                        <Paragraph style={{marginLeft: 15}}>We would love to know how your experience was!</Paragraph>
                        <Caption style={{marginTop: 10}}>Choose the receiver:</Caption>
                        <RadioButton.Group value={receiver} onValueChange={(value) => {
                            setReceiver(value)
                        }}>
                            <Dialog.ScrollArea>
                                <ScrollView persistentScrollbar={true} style={{maxHeight: 80}}>
                                    {feedbackMenuItems}
                                </ScrollView>
                            </Dialog.ScrollArea>
                        </RadioButton.Group>
                        <Caption style={{marginTop: 10}}>Leave your feedback!</Caption>
                        <TextInput
                            style={{maxHeight: 88}}
                            label="Feedback"
                            value={comment}
                            onChangeText={text => setComment(text)}
                            placeholder={"Write your Feedback here"}
                            multiline={true}
                            numberOfLines={2}
                        />
                        <Caption style={{marginTop: 10}}>Leave your rating!</Caption>
                        <StarRating
                            halfStarEnabled
                            rating={vote}
                            starSize={30}
                            selectedStar={(rating) => setVote(rating)}
                            fullStarColor={"#d6a000"}
                            // containerStyle={{width: 100, marginLeft: 0, position: "absolute", right: 30}}
                            emptyStarColor={"#808080"}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Close</Button>
                        <Button onPress={() => {
                            axios
                                .post(
                                    createFeedbackURL(event.id, receiver),
                                    {
                                        receiver: receiver,
                                        event: event.id,
                                        comment: comment,
                                        vote: vote,
                                    },
                                    headers('application/json', token)
                                )
                                .then((res) => {
                                    setVisible(false)
                                })
                                .catch((error) => {
                                    console.log(error)
                                    ToastAndroid.show("Couldn't post feedback", ToastAndroid.SHORT)
                                })
                        }}>SUBMIT</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default EventComputedYourCarComponent;