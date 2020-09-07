import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {connect} from 'react-redux';
import {Caption, Drawer, Title,} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {HOME_SCREEN, PROFILE_STACK,} from '../../constants/screens';
import {URLtoScreenWithProps} from '../../utils/utils';
import {authLogout} from '../../actions/authActions';
import CustomAvatar from "../CustomAvatar";
import {readNotification} from "../../actions/notificationsActions";

/**
 * Notification Drawer Item.
 */
const NotificationDrawerItem = (props) => (
    <DrawerItem
        label={props.notification.title}
        icon={({color, size}) => (
            <Icon name="chevron-right" color={color} size={size}/>
        )}
        onPress={async () => {
            let screenWithProps = await URLtoScreenWithProps(props.notification.url, props.token);
            await props.readNotification(props.notification.id)
            props.navigation.navigate(
                screenWithProps.screen,
                screenWithProps.props,
            );

        }}
    />
)

/**
 * User information:
 * - Avatar
 * - Full name
 * - username
 */
const UserInfoDrawerComponent = (props) => (
    <View style={styles.userInfoDrawerComponent}>
        <CustomAvatar picture={props.picture}
                      firstName={props.firstName}
                      lastName={props.lastName}/>
        <View style={styles.userInfoDrawerComponentText}>
            <Title style={styles.title}>
                {props.firstName + ' ' + props.lastName}
            </Title>
            <Caption style={styles.caption}>{props.username}</Caption>
        </View>
    </View>
)

/**
 * Navigation section. Contains two buttons:
 * - Home: to navigate to the *EventsListScreen*
 * - Profile: to navigate to the *PersonalProfileScreen*
 */
const DrawerNavigationSection = (props) => (
    <Drawer.Section style={styles.drawerSection}
                    title={'Pages:'}>
        <DrawerItem
            label="Home"
            icon={({color, size}) => (
                <Icon name="home-outline"
                      color={color}
                      size={size}/>
            )}
            onPress={() => {
                props.navigation.navigate(HOME_SCREEN);
                props.navigation.closeDrawer();
            }}
        />
        <DrawerItem
            label="Profile"
            icon={({color, size}) => (
                <Icon name="account"
                      color={color}
                      size={size}/>
            )}
            onPress={() => {
                props.navigation.navigate(PROFILE_STACK);
                props.navigation.closeDrawer();
            }}
        />
    </Drawer.Section>
)

/**
 * SignOut button. Runs the {@link authLogout} action
 */
const SignOutButton = (props) => (
    <DrawerItem
        label="Sign Out"
        icon={({color, size}) => (
            <Icon name="exit-to-app"
                  color={color}
                  size={size}/>
        )}
        onPress={() => {
            props.logout();
        }}
    />
)

/**
 * Drawer component that contains:
 * - User information on top {@link UserInfoDrawerComponent}
 * - Event and Profile stack navigation buttons {@link DrawerNavigationSection}
 * - unread notifications {@link NotificationDrawerItem}
 * - signout button {@link SignOutButton}
 */
const CustomDrawerContentComponent = (props) => {

    let notificationsByDescDate = props.notifications.sort(
        function (a, b) {
            return new Date(b.date_time) - new Date(a.date_time)
        })

    const notificationListItems = notificationsByDescDate.filter((notification) => !notification.read).map((notification) => (
        <NotificationDrawerItem
            key={notification.id}
            notification={notification}
            token={props.token}
            navigation={props.navigation}
            readNotification={props.readNotification}/>
    ));

    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <UserInfoDrawerComponent {...props}/>
                    </View>
                    <DrawerNavigationSection {...props}/>
                    <Drawer.Section style={styles.drawerSection} title="Notifications:">
                        {notificationListItems}
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <SignOutButton {...props}/>
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
    userInfoDrawerComponent: {
        flexDirection: 'row',
        marginTop: 15
    },
    userInfoDrawerComponentText: {
        marginLeft: 15,
        flexDirection: 'column'
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
        token: state.auth.token,
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
        readNotification: (id) => dispatch(readNotification(id))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CustomDrawerContentComponent);