import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator, DrawerItem} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import CustomDrawerComponent from './components/CustomDrawerComponent';
import {
    ADD_CAR_SCREEN, DRAWER,
    EVENT_SCREEN,
    HOME_SCREEN,
    HOME_STACK,
    JOIN_SCREEN, LOADING_SCREEN,
    LOGIN_SCREEN, OTHER_PROFILE_SCREEN,
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
import LoadingScreen from "./screens/LoadingScreen";
import {Button, Colors, Badge} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TouchableRipple from "react-native-paper/src/components/TouchableRipple/index";
import PersonalProfileScreen from "./screens/PersonalProfileScreen";
import {View} from "react-native";
import DrawerIcon from "./components/DrawerIcon";


//https://reactnavigation.org/blog/2020/01/29/using-react-navigation-5-with-react-native-paper/
const Drawer = createDrawerNavigator();
const EventStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const AuthStack = createStackNavigator();

const drawerIcon = (navigation, notifications) => () => (
    <DrawerIcon navigation={navigation}/>
)

const Events = (props) => {
    return (
        <EventStack.Navigator>
            <EventStack.Screen name={HOME_SCREEN} component={EventsListScreen}
                               options={{headerRight: drawerIcon(props.navigation, props.notifications),}}/>
            <EventStack.Screen name={EVENT_SCREEN} component={EventScreen}
                               options={({route}) => ({
                                   title: `${route.params.event.name}`,
                                   headerRight: drawerIcon(props.navigation, props.notifications),
                               })}/>
            <EventStack.Screen name={JOIN_SCREEN} component={JoinScreen} options={{
                headerRight: drawerIcon(props.navigation, props.notifications),
            }}/>
            <EventStack.Screen name={OTHER_PROFILE_SCREEN} component={ProfileScreen}
                               options={({route}) => ({
                                   title: `Profile`,
                                   headerRight: drawerIcon(props.navigation, props.notifications)
                               })}/>
        </EventStack.Navigator>
    );
};

connect(mapStateToProps, mapDispatchToProps)(Events);

const Profile = (props) => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name={PROFILE_SCREEN} component={PersonalProfileScreen}
                                 options={{headerRight: drawerIcon(props.navigation, props.notifications),}}/>
            <ProfileStack.Screen name={ADD_CAR_SCREEN} component={AddCarScreen}
                                 options={({route}) => ({
                                     title: `${route.params.edit ? "Edit car" : "Add car"}`,
                                     headerRight: drawerIcon(props.navigation, props.notifications)
                                 })}/>
        </ProfileStack.Navigator>
    );
};

connect(mapStateToProps, mapDispatchToProps)(Profile);

const Navigation = (props) => {
    /*const {isAuthenticated, isLoading, username, alerts, profileId, error} = props*/
    if (!props.isAuthenticated && !props.error && !props.isLoading) {
        console.log("Try Auto Signup")
        props.onTryAutoSignup();
    }

    return (
        <>
            {props.isAuthenticated ? (
                <Drawer.Navigator
                    drawerContent={(props) => <CustomDrawerComponent {...props} />}>
                    <Drawer.Screen
                        name={HOME_STACK}
                        component={Events}
                    />
                    <Drawer.Screen name={PROFILE_STACK} component={Profile}/>
                </Drawer.Navigator>
            ) : (

                <AuthStack.Navigator>
                    <AuthStack.Screen name={LOGIN_SCREEN} component={LoginScreen}/>
                </AuthStack.Navigator>
            )}
        </>
    );

};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !== undefined,
        isLoading: state.auth.loading,
        username: state.profile.user.username,
        alerts: state.alerts,
        profileId: state.profile.id,
        error: state.auth.error || state.profile.error || state.notifications.error,
        notifications: state.notifications.notifications
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoSignup: () => dispatch(authCheckState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
//https://dev.to/markusclaus/fetching-data-from-an-api-using-reactredux-55ao