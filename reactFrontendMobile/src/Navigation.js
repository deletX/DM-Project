import * as React from "react"
import {NavigationContainer} from "@react-navigation/native";
import {createDrawerNavigator, DrawerItem} from "@react-navigation/drawer";
import {createStackNavigator} from "@react-navigation/stack";
import CustomDrawerComponent from "./components/CustomDrawerComponent";
import {
    ADD_CAR_SCREEN,
    EVENT_SCREEN,
    HOME_SCREEN,
    JOIN_SCREEN,
    LOGIN_SCREEN,
    PROFILE_SCREEN
} from "./constants/screens";

import LoginScreen from "./screens/LoginScreen";
import AddCarScreen from "./screens/AddCarScreen";
import ProfileScreen from "./screens/ProfileScreen";
import JoinScreen from "./screens/JoinScreen";
import EventScreen from "./screens/EventScreen";
import EventsScreen from "./screens/EventsScreen";

const Drawer = createDrawerNavigator();
const EventStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const AuthStack = createStackNavigator();

const isAuthenticated = false;

const Events = () => {

    return (
        <EventStack.Navigator>
            <EventStack.Screen name={EVENT_SCREEN} component={EventsScreen}/>
            <EventStack.Screen name={HOME_SCREEN} component={EventScreen}/>
            <EventStack.Screen name={JOIN_SCREEN} component={JoinScreen}/>
        </EventStack.Navigator>
    )
}

const Profile = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name={PROFILE_SCREEN} component={ProfileScreen}/>
            <ProfileStack.Screen name={ADD_CAR_SCREEN} component={AddCarScreen}/>
        </ProfileStack.Navigator>

    )
}

const Navigation = (props) => {
    /*const {isAuthenticated, isLoading, username, alerts, profileId, error} = props*/


    return (
        <NavigationContainer>
            {isAuthenticated ? (
                <Drawer.Navigator drawerContent={(props) => (
                    <CustomDrawerComponent {...props}/>
                )}>
                    <Drawer.Screen name="Events" component={Events}/>
                    <Drawer.Screen name="Profile" component={Profile}/>
                </Drawer.Navigator>
            ) : (
                <AuthStack.Navigator>
                    <AuthStack.Screen name={LOGIN_SCREEN} component={LoginScreen}/>
                </AuthStack.Navigator>
            )}
        </NavigationContainer>
    )
}

export default Navigation;