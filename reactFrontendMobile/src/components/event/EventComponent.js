import * as React from 'react';
import {Button, Card, Colors, Paragraph, ProgressBar, Title} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import {COMPUTED, COMPUTING, JOINABLE} from "../../constants/constants";
import {EVENT_SCREEN, JOIN_SCREEN} from "../../constants/screens";
import {useNavigation} from "@react-navigation/native"
import moment from "moment";
import {connect} from 'react-redux';
import {deleteLeaveEvent} from "../../utils/api";
import {alertAreYouSure} from "../../utils/utils";

/**
 * Text card content:
 * - Event title
 * - Event date and time
 * - Event address
 * - Event description
 */
const EventCardContent = (props) => (
    <Card.Content>
        <Title>{props.event.name}</Title>
        <Paragraph>{moment(props.event.date_time).format("dddd D MMMM YYYY, HH:mm")}</Paragraph>
        <Paragraph>{props.event.address}</Paragraph>
        <Paragraph>{props.event.description}</Paragraph>
    </Card.Content>
)

/**
 * Card actions:
 * - Join button (disabled if is not joinable or joined)
 */
const EventCardActions = (props) => {

    const leaveEvent = async () => {
        await deleteLeaveEvent(props.event.id, props.token, participation.id, props.reload);
    }

    const navigation = useNavigation();
    let participation = props.event.participant_set.filter(item => (item.profile.id === props.profileID))[0];

    return (<Card.Actions>
        <Button mode={props.event.status === JOINABLE ? "contained" : "text"} color="#00675b"
                onPress={() => navigation.navigate((JOIN_SCREEN), {event: props.event, id: props.event.id})}
                disabled={props.event.status === JOINABLE && participation === undefined ? null : "true"}
        >Join event</Button>

        <Button mode="text" color="#c56200"
                onPress={alertAreYouSure(leaveEvent)} style={styles.buttonRight}
                disabled={(props.event.status === JOINABLE && (participation !== undefined)) ? null : "true"}>Leave
            event</Button>
    </Card.Actions>)
}

/**
 * Event Card:
 * - Event picture cover
 * - Progress bar if event is computing
 * - Card content {@link EventCardContent}
 * - Card actions (join, leave) {@link EventCardActions}
 */
const EventComponent = (props) => {

    const navigation = useNavigation();

    return (
        <View
            key={props.id}
            pointerEvents={(props.event.status === JOINABLE || props.event.status === COMPUTED) ? "auto" : "none"}
        >
            <Card style={styles.card}
                  key={props.event.id}
                  onPress={() => {
                      navigation.navigate(EVENT_SCREEN, {event: props.event, id: props.event.id})
                  }}
                  accessible={true}>
                <Card.Cover source={{uri: props.event.picture}}/>

                {props.event.status === COMPUTING &&
                <ProgressBar indeterminate={true} animating color={Colors.orangeA400}
                             style={styles.spinner}/>
                }

                <EventCardContent {...props}/>

                <EventCardActions {...props}/>

            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15
    },
    buttonRight: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    spinner: {
        width: "100%",
        height: 7
    }

});

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        profileID: state.profile.id
    };
}

export default connect(
    mapStateToProps,
)(EventComponent);
