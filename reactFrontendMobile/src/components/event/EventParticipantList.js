import React from 'react';
import {Colors, Headline, List, Paragraph} from "react-native-paper";
import {ScrollView, useWindowDimensions, View,} from "react-native";
import CustomAvatar from "../CustomAvatar";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/MaterialIcons";
import ParticipantListItem from "./ParticipantListItem";


const EventParticipantList = (props) => {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const {styles, event} = props
    const participantsListItems = event.participant_set.map((participant) => (
        <ParticipantListItem key={participant.id} participant={participant}/>
    ))
    return (
        <>
            <Headline style={styles.header}>
                Participants
            </Headline>
            {event.participant_set.length === 0 ?

                <Paragraph>
                    Seems there's no one here... yet ;)
                </Paragraph>
                :
                <ScrollView style={{maxHeight: windowHeight * 0.3}}>
                    {participantsListItems}
                </ScrollView>

            }

        </>
    );
};

export default EventParticipantList;