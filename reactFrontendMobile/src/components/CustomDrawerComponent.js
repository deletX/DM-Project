import * as React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {DrawerItems} from 'react-navigation-drawer';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
import {connect} from 'react-redux';

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
import {
    EVENT_SCREEN,
    HOME_SCREEN,
    LOGIN_SCREEN,
    PROFILE_SCREEN,
    PROFILE_STACK,
} from '../constants/screens';
import {URLtoScreenWithProps} from '../utils';
import {authLogout} from '../actions/authActions';


const CustomDrawerContentComponent = (props) => {
    const notificationListItems = props.notifications.map((notification) => (
        <DrawerItem
            key={notification.id}
            label={notification.title}
            icon={({color, size}) => (
                <Icon name="chevron-right" color={color} size={size}/>
            )}
            onPress={() => {
                let screenwithProps = URLtoScreenWithProps(notification.url);
                console.log(screenwithProps);
                props.navigation.navigate(
                    screenwithProps.screen,
                    screenwithProps.props,
                );
            }}
        />
    ));


    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                            {(props.picture !== null || props.picture === '') ? (
                                <Avatar.Image source={{uri: props.picture}} size={50}/>
                            ) : (
                                <Avatar.Text label={`${props.firstName[0]}${props.lastName[0]}`.toUpperCase()} size={50} labelStyle={{fontSize: 21}}/>
                            )}

                            <View style={{marginLeft: 15, flexDirection: 'column'}}>
                                <Title style={styles.title}>
                                    {props.firstName + ' ' + props.lastName}
                                </Title>
                                <Caption style={styles.caption}>{props.username}</Caption>
                            </View>
                        </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection} title={'Pages:'}>
                        <DrawerItem
                            label="Home"
                            icon={({color, size}) => (
                                <Icon name="home-outline" color={color} size={size}/>
                            )}
                            onPress={() => {
                                props.navigation.navigate(HOME_SCREEN);
                                props.navigation.closeDrawer();
                            }}
                        />
                        <DrawerItem
                            label="Profile"
                            icon={({color, size}) => (
                                <Icon name="account" color={color} size={size}/>
                            )}
                            onPress={() => {
                                props.navigation.navigate(PROFILE_STACK);
                                props.navigation.closeDrawer();
                            }}
                        />
                    </Drawer.Section>
                    <Drawer.Section style={styles.drawerSection} title="Notifications:">
                        {notificationListItems}
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    label="Sign Out"
                    icon={({color, size}) => (
                        <Icon name="exit-to-app" color={color} size={size}/>
                    )}
                    onPress={() => {
                        console.log('logout');
                        props.logout();
                    }}
                />
            </Drawer.Section>
        </View>
    );
};

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
        borderTopWidth: 1,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});

function mapStateToProps(state) {
    return {
        username: state.profile.user.username,
        firstName: state.profile.user.first_name,
        lastName: state.profile.user.last_name,
        notifications: state.notifications.notifications,
        picture: state.profile.picture,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(authLogout()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CustomDrawerContentComponent);
