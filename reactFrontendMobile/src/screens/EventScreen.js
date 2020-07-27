import * as React from 'react';
import {ScrollView, View, ImageBackground, useWindowDimensions, StyleSheet, Image} from "react-native"
import {Colors, Divider, Headline, IconButton, Paragraph, Subheading, Text, Title} from "react-native-paper"
import moment from "moment";
import MapView from "react-native-maps";

const EventScreen = (props) => {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const event = props.route.params.event
    const scrollViewRef = React.useRef()
    return (
        <ScrollView /*style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}*/ ref={scrollViewRef}>
            <View>
                <ImageBackground source={{uri: event.picture}}
                                 style={[styles.image, {height: windowHeight - 80}]}>
                    <View style={styles.overlay}>
                        <View style={{marginLeft: windowWidth * 0.05}}>
                            <Title style={{color: Colors.white, fontSize: 50, lineHeight: 80}}>{event.name}</Title>
                            <Subheading style={{
                                color: Colors.white,
                                marginTop: windowHeight * 0.3
                            }}>Date: {moment(event.date_time).format("dddd D MMMM YYYY, HH:mm")}}</Subheading>
                            <Subheading
                                style={{color: Colors.white, marginTop: 20}}>Destination: {event.address}</Subheading>
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
                                    scrollViewRef.current.scrollTo({x: 0, y: windowHeight, animated: true})
                                }}
                            />
                        </View>
                    </View>
                </ImageBackground>

                <View/>
            </View>
            <View>
                <Headline>
                    Description
                </Headline>
                <Paragraph>
                    {event.description}
                </Paragraph>
                <Divider/>
                <Headline>
                    Destination
                </Headline>
                {/*<MapView*/}
                {/*    initialRegion={{*/}
                {/*        latitude: 37.78825,*/}
                {/*        longitude: -122.4324,*/}
                {/*        latitudeDelta: 0.0922,*/}
                {/*        longitudeDelta: 0.0421,*/}
                {/*    }}*/}
                {/*/>*/}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"

    },
    text: {
        color: "grey",
        fontSize: 30,
        fontWeight: "bold"
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.40)',
        flex: 1,
        justifyContent: "center",

    }
});

export default EventScreen;