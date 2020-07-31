import * as React from 'react';
import {
    Card,
    Button,
    Title,
    Paragraph,
    Colors,
    ProgressBar,
    Portal,
    Dialog
} from 'react-native-paper';
import {Alert, StyleSheet, View} from "react-native";
import {COMPUTED, COMPUTING, JOINABLE} from "../constants/constants";
import EventScreen from "../screens/EventScreen";
import {EVENT_SCREEN, HOME_SCREEN, JOIN_SCREEN} from "../constants/screens";
import {useNavigation} from "@react-navigation/native"
import moment from "moment";
import {deleteLeaveEvent} from "../utils";


const EventComponent = (props) => {

    const navigation = useNavigation();

    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => {
        setVisible(false);
    };

    let participation = props.event.participant_set.filter(item => (item.profile.id === props.profileID))[0];

    const leaveEvent = async () => {
        setVisible(false);
        console.log(props.event.participant_set, props.profileID, props.event.id, props.token);
        //props.event.participant_set.filter(item => (item.profile.id === props.profileID)).length = 0

        await deleteLeaveEvent(props.event.id, props.token, participation.id, props.reload);
    }

    return (
        <View
            key={props.id}
            pointerEvents={(props.event.status === JOINABLE || props.event.status === COMPUTED) ? "auto" : "none"}
            // opacity={(props.event.status === JOINABLE || props.event.status === COMPUTED) ? 1 : 0.4}
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
                             style={styles.spinner}/>}

                <Card.Content>
                    <Title>{props.event.name}</Title>
                    <Paragraph>{moment(props.event.date_time).format("dddd D MMMM YYYY, HH:mm")}</Paragraph>
                    <Paragraph>{props.event.address}</Paragraph>
                    <Paragraph>{props.event.description}</Paragraph>
                </Card.Content>

                <Card.Actions>
                    <Button mode={props.event.status === JOINABLE ? "contained" : "text"} color="#00675b"
                            onPress={() => navigation.navigate((JOIN_SCREEN), {event: props.event, id: props.event.id})}
                            disabled={props.event.status === JOINABLE ? null : "true"}
                    >Join event</Button>

                    <Button mode="text" color="#c56200"
                            onPress={() => Alert.alert(
                                "Are you sure?",
                                "There is no coming back",
                                [
                                    {text: "No", style: 'cancel'},
                                    {
                                        text: "Yes", onPress: leaveEvent
                                    }
                                ],
                                {cancelable: true}
                            )} style={styles.buttonRight}
                            disabled={(props.event.status === JOINABLE && (participation !== undefined) )? null : "true"}>Leave
                        event</Button>


                    {/*<Portal>*/}
                    {/*    <Dialog visible={visible} onDismiss={hideDialog}>*/}
                    {/*        <Dialog.Title>Do you really want to leave this event?</Dialog.Title>*/}
                    {/*        <Dialog.Content>*/}
                    {/*            <Paragraph>There is no coming back</Paragraph>*/}
                    {/*        </Dialog.Content>*/}
                    {/*        <Dialog.Actions>*/}
                    {/*            <Button onPress={hideDialog}>Cancel</Button>*/}
                    {/*            <Button onPress={leaveEvent}>Ok</Button>*/}
                    {/*        </Dialog.Actions>*/}
                    {/*    </Dialog>*/}
                    {/*</Portal>*/}


                </Card.Actions>
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

import {connect} from 'react-redux';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        profileID: state.profile.id
    };
}


export default connect(
    mapStateToProps,
)(EventComponent);

// https://reactjs.org/warnings/special-props.html
// https://stackoverflow.com/questions/39720039/can-i-disable-a-view-component-in-react-native
// https://stackoverflow.com/questions/36147082/react-native-style-opacity-for-parent-and-child/45788137