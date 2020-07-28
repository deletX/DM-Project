import React from 'react';
import {ImageBackground, useWindowDimensions, View} from "react-native";
import {Button, Colors, IconButton, Subheading, Title} from "react-native-paper";
import moment from "moment";

const EventHeaderComponent = (props) => {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const {styles, profileId} = props
    const event = props.route.params.event
    const isOwner = props.profileId === event.owner.id
    return (
        <View>
            <ImageBackground source={{uri: event.picture}}
                             style={[styles.image, {height: windowHeight - 80}]}>
                <View style={styles.overlay}>
                    <View style={{marginLeft: windowWidth * 0.05}}>
                        <Title style={{color: Colors.white, fontSize: 50, lineHeight: 80}}>{event.name}</Title>
                        <Subheading style={{
                            color: Colors.white,
                            marginTop: windowHeight * 0.3
                        }}>Date: {moment(event.date_time).format("dddd D MMMM YYYY, HH:mm")}</Subheading>
                        <Subheading
                            style={{
                                color: Colors.white,
                                marginTop: 20
                            }}>Destination: {event.address}</Subheading>
                    </View>
                    <View
                        style={{
                            justifyContent: "center",
                            alignitems: "center",
                            flexDirection: "row",
                            position: "absolute",
                            bottom: 10,
                            left: windowWidth / 2 - 30,
                        }}>
                        <IconButton
                            icon="arrow-down-drop-circle-outline"
                            color={Colors.grey200}
                            size={30}
                            onPress={() => {
                                props.scrollViewRef.current.scrollTo({x: 0, y: windowHeight - 80, animated: true})
                            }}
                        />
                        {isOwner &&
                        <>
                            <Button
                                color={Colors.redA700}
                                style={{position: "absolute", top: 10, left: -100}}
                                onPress={() => {
                                    console.log("leave-pressed")
                                }}
                            >
                                delete
                            </Button>

                            <Button
                                style={{position: "absolute", top: 10, left: 80}}
                                color={Colors.tealA700}
                                onPress={() => {
                                    console.log("run-pressed")
                                }}
                            >

                                run
                            </Button>
                        </>
                        }

                    </View>
                </View>
            </ImageBackground>

            <View/>
        </View>
    );
};

export default EventHeaderComponent;