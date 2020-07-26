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
    LOGIN_SCREEN,
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
import {Button, Colors} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TouchableRipple from "react-native-paper/src/components/TouchableRipple/index";


//https://reactnavigation.org/blog/2020/01/29/using-react-navigation-5-with-react-native-paper/
const Drawer = createDrawerNavigator();
const EventStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const AuthStack = createStackNavigator();


const Events = (props) => {
    return (
        <EventStack.Navigator>
            <EventStack.Screen name={HOME_SCREEN} component={EventsListScreen} options={{
                headerRight: () => (

                    <Icon
                        name="menu"
                        color={Colors.teal700}
                        size={30}
                        style={{marginRight: 20}}
                        onPress={() => {
                            props.navigation.toggleDrawer()
                        }}
                    />

                ),
            }}/>
            <EventStack.Screen name={EVENT_SCREEN} component={EventScreen}/>
            <EventStack.Screen name={JOIN_SCREEN} component={JoinScreen}/>
        </EventStack.Navigator>
    );
};

const Profile = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name={PROFILE_SCREEN} component={ProfileScreen}/>
            <ProfileStack.Screen name={ADD_CAR_SCREEN} component={AddCarScreen}/>
        </ProfileStack.Navigator>
    );
};

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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoSignup: () => dispatch(authCheckState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
//https://dev.to/markusclaus/fetching-data-from-an-api-using-reactredux-55ao