import * as React from 'react';
import {Card, Button, Title, Paragraph, Text} from 'react-native-paper';
import {Alert, StyleSheet, View} from "react-native";
import {COMPUTED, COMPUTING, JOINABLE} from "../constants/constants";


const EventComponent = (props) => (
        <View
            key={props.id}
            pointerEvents={props.status === JOINABLE ? "auto" : "none"}
            opacity={props.status === JOINABLE ? 1 : 0.4}
        >

            <Card style={styles.card}
                  key={props.id}
                  onPress={() => {
                      Alert.alert("You are moving to detail event screen");
                  }}
                  accessible={true}>
                <Card.Content>
                    <Title>{props.title}</Title>
                    <Paragraph>{props.date}</Paragraph>
                    <Paragraph>{props.address}</Paragraph>
                    <Paragraph>{props.description}</Paragraph>
                </Card.Content>
                <Card.Cover source={{uri: props.picture}}/>
                <Card.Actions>
                    <Button onPress={() =>
                        Alert.alert("You joined this event")
                    }>Join event</Button>
                    <Button onPress={() => {
                        Alert.alert("You left this event")
                    }} style={styles.buttonRight}>Leave event</Button>
                </Card.Actions>
            </Card>
        </View>
    )
;


const styles = StyleSheet.create({
    card: {
        marginTop: 15,
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
    }
});

export default EventComponent;

// https://reactjs.org/warnings/special-props.html
// https://stackoverflow.com/questions/39720039/can-i-disable-a-view-component-in-react-native
// https://stackoverflow.com/questions/36147082/react-native-style-opacity-for-parent-and-child/45788137