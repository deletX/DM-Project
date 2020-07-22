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
    "title": "Prova1 started computing",
    "content": "The computation for the event has started",
    "read": true,
    "url": "/events/23"
}, {
    "id": 6,
    "date_time": "2020-07-15T15:40:35.969730Z",
    "title": "Prova1 started computing",
    "content": "The computation for the event has started",
    "read": true,
    "url": "/events/23"
}]


const CustomDrawerContentComponent = (props) => {

    // const notificationListItems = notifications.map((notification) => (
    //     <ListItem icon>
    //         <Left>
    //             <Button onPress={() => {
    //                 console.log("Pressed notificaiton")
    //             }}>
    //                 <Icon active name="keyboard_arrow_right"/>
    //             </Button>
    //         </Left>
    //         <Body>
    //             <Text>{notification.title}</Text>
    //         </Body>
    //     </ListItem>
    // ))

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
                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Following</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>3</Paragraph>
                                <Caption style={styles.caption}>Follower</Caption>
                            </View>
                        </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem label="Home"
                                    icon={({color, size}) => (
                                        <Icon
                                            name="home-outline"
                                            color={color}
                                            size={size}
                                        />
                                    )}
                                    onPress={() => {
                                        console.log("Home")
                                    }}/>
                        <DrawerItem label="Profile"
                                    icon={({color, size}) => (
                                        <Icon
                                            name="person"
                                            color={color}
                                            size={size}
                                        />
                                    )}
                                    onPress={() => {
                                        console.log("Profile")
                                    }}/>
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
                                console.log("exit")
                            }}/>
            </Drawer.Section>

        </View>
    );

}
//                 {/*<View*/}
//                 {/*    forceInset={{top: 'always', horizontal: 'never'}}*/}
//                 {/*>*/}
//                 {/*    <View>*/}
//                 {/*        <View style={{justifyContent: 'center', alignItems: 'center'}}>*/}
//
//                 {/*            <Text style={{*/}
//                 {/*                color: '#f9f9f9',*/}
//                 {/*                marginTop: '3%',*/}
//                 {/*                fontFamily: 'sans-serif-condensed'*/}
//                 {/*            }}>{`Hi ${username}`}</Text>*/}
//                 {/*        </View>*/}
//                 {/*    </View>*/}
//
//                 {/*    <DrawerItems {...props} />*/}
//                 {/*    <DrawerItem label={"Logout"} onPress={() => {*/}
//                 {/*        console.log("logout")*/}
//                 {/*    }}/>*/}
//                 {/*    <View>*/}
//                 {/*        <Text>Notifications:</Text>*/}
//                 {/*        <Separator/>*/}
//                 {/*        {notificationListItems}*/}
//                 {/*    </View>*/}
//                 {/*</View>*/}

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