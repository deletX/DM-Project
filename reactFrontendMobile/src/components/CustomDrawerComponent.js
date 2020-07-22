import * as React from "react";
import {View, ScrollView, StyleSheet} from "react-native"
import {SafeAreaView} from "react-navigation";
import {DrawerItems} from "react-navigation-drawer"
import {DrawerItem, DrawerContentScrollView} from "@react-navigation/drawer"

import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {EVENT_SCREEN, HOME_SCREEN, LOGIN_SCREEN, PROFILE_SCREEN, PROFILE_STACK} from "../constants/screens";
import {URLtoScreenWithProps} from "../utils";

const profile = {
    username: "mock-username",
    img: "https://api.adorable.io/avatars/50/abott@adorable.png",
    name: "mock",
    surname: "fake",
}

const notifications = [{
    "id": 8,
    "date_time": "2020-07-15T15:40:35.969730Z",
    "title": "Prova1 started computing",
    "content": "The computation for the event has started",
    "read": true,
    "url": "/events/23"
}, {
    "id": 9,
    "date_time": "2020-07-15T15:40:35.969730Z",
    "title": "Prova31 started computing",
    "content": "The computation for the event has started",
    "read": true,
    "url": "/events/24"
}, {
    "id": 6,
    "date_time": "2020-07-15T15:40:35.969730Z",
    "title": "Prova2 started computing",
    "content": "The computation for the event has started",
    "read": true,
    "url": "/events/25"
}]


const CustomDrawerContentComponent = (props) => {

    const notificationListItems = notifications.map((notification) => (
        <DrawerItem key={notification.id} label={notification.title}
                    icon={({color, size}) => (
                        <Icon
                            name="chevron-right"
                            color={color}
                            size={size}
                        />
                    )}
                    onPress={() => {
                        let screenwithProps = URLtoScreenWithProps(notification.url);
                        console.log(screenwithProps)
                        props.navigation.navigate(screenwithProps.screen, screenwithProps.props)
                    }}/>
    ))

    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                            <Avatar.Image
                                source={{uri: profile.img}}
                                size={50}
                            />
                            <View style={{marginLeft: 15, flexDirection: 'column'}}>
                                <Title style={styles.title}>
                                    {profile.name + " " + profile.surname}
                                </Title>
                                <Caption style={styles.caption}>
                                    {profile.username}
                                </Caption>
                            </View>
                        </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection} title={"Pages:"}>
                        <DrawerItem label="Home"
                                    icon={({color, size}) => (
                                        <Icon
                                            name="home-outline"
                                            color={color}
                                            size={size}
                                        />
                                    )}
                                    onPress={() => {
                                        props.navigation.navigate(HOME_SCREEN)
                                        props.navigation.closeDrawer()
                                    }}/>
                        <DrawerItem label="Profile"
                                    icon={({color, size}) => (
                                        <Icon
                                            name="account"
                                            color={color}
                                            size={size}
                                        />
                                    )}
                                    onPress={() => {
                                        props.navigation.navigate(PROFILE_STACK)
                                        props.navigation.closeDrawer()
                                    }}/>
                    </Drawer.Section>
                    <Drawer.Section style={styles.drawerSection} title="Notifications:">
                        {notificationListItems}
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem label="Sign Out"
                            icon={({color, size}) => (
                                <Icon
                                    name="exit-to-app"
                                    color={color}
                                    size={size}
                                />
                            )}
                            onPress={() => {
                                console.log("logout")
                                //TODO: call the logout
                            }}/>
            </Drawer.Section>

        </View>
    );

}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});

export default CustomDrawerContentComponent;