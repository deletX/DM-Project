import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import CustomDrawerComponent from './components/drawer/CustomDrawerComponent';
import {
    ADD_CAR_SCREEN,
    EVENT_SCREEN,
    HOME_SCREEN,
    HOME_STACK,
    JOIN_SCREEN,
    LOGIN_SCREEN,
    OTHER_PROFILE_SCREEN,
    PROFILE_SCREEN,
    PROFILE_STACK,
} from './constants/screens';
import LoginScreen from './screens/LoginScreen';
import AddCarScreen from './screens/AddCarScreen';
import ProfileScreen from './screens/ProfileScreen';
import JoinScreen from './screens/JoinScreen';
import EventScreen from './screens/EventScreen';
import EventsListScreen from './screens/EventsListScreen';
import {authCheckState} from './actions/authActions';
import {connect} from 'react-redux';
import PersonalProfileScreen from "./screens/PersonalProfileScreen";
import DrawerIcon from "./components/drawer/DrawerIcon";

/**
 * Drawer Navigator
 */
const Drawer = createDrawerNavigator();

/**
 * Event Stack Navigator
 */
const EventStack = createStackNavigator();

/**
 * Profile Stack Navigator
 */
const ProfileStack = createStackNavigator();

/**
 * Authentication Stack Navigator
 */
const AuthStack = createStackNavigator();

/**
 * Returns a function that gives the {@link DrawerIcon} with the navigation needed to open the Drawer
 *
 * @param navigation react-navigation navigation
 *
 * @return {function()}
 */
export const drawerIcon = (navigation) => () => (
    <DrawerIcon navigation={navigation}/>
)

/**
 * Event functional component. Contains the EventStack with its screen:
 * - Home screen
 * - Event screen
 * - Join screen
 * - Other profile screen
 */
const Events = (props) => {
    return (
        <EventStack.Navigator>
            <EventStack.Screen name={HOME_SCREEN}
                               component={EventsListScreen}
                               options={{
                                   headerRight: drawerIcon(props.navigation),
                               }}/>
            <EventStack.Screen name={EVENT_SCREEN}
                               component={EventScreen}
                               options={
                                   ({route}) => ({
                                       title: `${route.params.event.name}`,
                                       headerRight: drawerIcon(props.navigation),
                                   })}/>
            <EventStack.Screen name={JOIN_SCREEN}
                               component={JoinScreen}
                               options={{
                                   headerRight: drawerIcon(props.navigation),
                               }}/>
            <EventStack.Screen name={OTHER_PROFILE_SCREEN}
                               component={ProfileScreen}
                               options={
                                   ({route}) => ({
                                       title: `Profile - ${route.params.profile.user.username}`,
                                       headerRight: drawerIcon(props.navigation)
                                   })}/>
        </EventStack.Navigator>
    );
};


/**
 * Profile functional component that contains the ProfileStack navigator and its screens:
 * - Profile screen
 * - add/edit car screen
 */
const Profile = (props) => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name={PROFILE_SCREEN}
                                 component={PersonalProfileScreen}
                                 options={{
                                     headerRight: drawerIcon(props.navigation),
                                 }}/>
            <ProfileStack.Screen name={ADD_CAR_SCREEN}
                                 component={AddCarScreen}
                                 options={
                                     ({route}) => ({
                                         title: `${route.params.edit ? "Edit car" : "Add car"}`,
                                         headerRight: drawerIcon(props.navigation)
                                     })}/>
            <ProfileStack.Screen name={OTHER_PROFILE_SCREEN}
                                 component={ProfileScreen}
                                 options={
                                     ({route}) => ({
                                         title: `Profile - ${route.params.profile.user.username}`,
                                         headerRight: drawerIcon(props.navigation)
                                     })}/>
        </ProfileStack.Navigator>
    );
};

/**
 * Main navigation container that contains the various stacks:
 * - Event stack
 * - Profile stack
 * - Authentication stack (contains the login screen)
 */
const Navigation = (props) => {

    // Check if it is already authenticated automatically
    if (!props.isAuthenticated && !props.error && !props.isLoading) {
        props.onTryAutoSignup();
    }

    return (
        <>
            {props.isAuthenticated ? (
                <Drawer.Navigator
                    drawerContent={(props) => (
                        <CustomDrawerComponent {...props} />
                    )}>
                    <Drawer.Screen name={HOME_STACK}
                                   component={Events}
                    />
                    <Drawer.Screen name={PROFILE_STACK}
                                   component={Profile}/>
                </Drawer.Navigator>
            ) : (
                <AuthStack.Navigator>
                    <AuthStack.Screen name={LOGIN_SCREEN}
                                      component={LoginScreen}/>
                </AuthStack.Navigator>
            )}
        </>
    );

};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !== undefined,
        isLoading: state.auth.loading,
        error: state.auth.error || state.profile.error || state.notifications.error,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoSignup: () => dispatch(authCheckState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);