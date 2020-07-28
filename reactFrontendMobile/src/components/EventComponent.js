import * as React from 'react';
import {
    Card,
    Button,
    Title,
    Paragraph,
    Text,
    DefaultTheme,
    ActivityIndicator,
    ProgressBar,
    Colors
} from 'react-native-paper';
import {Alert, StyleSheet, View} from "react-native";
import {COMPUTED, COMPUTING, JOINABLE} from "../constants/constants";
import EventScreen from "../screens/EventScreen";
import {EVENT_SCREEN} from "../constants/screens";
import {useNavigation} from "@react-navigation/native"
import moment from "moment";


const EventComponent = (props) => {

    const navigation = useNavigation();

    return (
        <View
            key={props.id}
            pointerEvents={(props.event.status === JOINABLE || props.event.status === COMPUTED) ? "auto" : "none"}
            opacity={(props.event.status === JOINABLE || props.event.status === COMPUTED || props.event.status === COMPUTING) ? 1 : 0.4}
        >
            <Card style={styles.card}
                  key={props.event.id}
                  onPress={() => {
                      navigation.navigate(EVENT_SCREEN, {event: props.event, id: props.event.id})
                  }}
                  accessible={true}>
                <Card.Cover source={{uri: props.event.picture}}/>

                <Card.Content>
                    <Title>{props.event.name}</Title>
                    <Paragraph>{moment(props.event.date_time).format("dddd D MMMM YYYY, HH:mm")}</Paragraph>
                    <Paragraph>{props.event.address}</Paragraph>
                    <Paragraph>{props.event.description}</Paragraph>

                </Card.Content>

                {props.event.status === COMPUTING && <ProgressBar indeterminate={"true"} color={Colors.orange500}/>}

                <Card.Actions>

                    <Button mode="contained" color="#00675b"
                            onPress={() => Alert.alert("You joined this event")
                    }
                            disabled={props.event.status === JOINABLE ? null : "true"}>
                        Join event
                    </Button>

                    <Button mode="text" color="#c56200"
                            onPress={() =>
                        Alert.alert("You left this event")
                    }
                            style={styles.buttonRight}
                            disabled={props.event.status === JOINABLE ? null : "true"}>
                        Leave event
                    </Button>
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
        flex: 1,
        marginBottom: 15
    }

});

export default EventComponent;

// https://reactjs.org/warnings/special-props.html
// https://stackoverflow.com/questions/39720039/can-i-disable-a-view-component-in-react-native
// https://stackoverflow.com/questions/36147082/react-native-style-opacity-for-parent-and-child/45788137