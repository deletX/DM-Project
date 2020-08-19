import React from 'react';
import {Headline, Paragraph} from "react-native-paper";
import {ScrollView, useWindowDimensions,} from "react-native";
import ParticipantListItem from "./ParticipantListItem";


/**
 * The participants are shown with {@link ParticipantListItem} if there are any
 *
 */
const EventParticipantList = (props) => {
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