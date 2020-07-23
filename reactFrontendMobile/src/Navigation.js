import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator, DrawerItem} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import CustomDrawerComponent from './components/CustomDrawerComponent';
import {
  ADD_CAR_SCREEN,
  EVENT_SCREEN,
  HOME_SCREEN,
  HOME_STACK,
  JOIN_SCREEN,
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

const Drawer = createDrawerNavigator();
const EventStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const AuthStack = createStackNavigator();

const isAuthenticated = true;

const Events = () => {
  return (
    <EventStack.Navigator>
      <EventStack.Screen name={HOME_SCREEN} component={EventsListScreen} />
      <EventStack.Screen name={EVENT_SCREEN} component={EventScreen} />
      <EventStack.Screen name={JOIN_SCREEN} component={JoinScreen} />
    </EventStack.Navigator>
  );
};

const Profile = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name={PROFILE_SCREEN} component={ProfileScreen} />
      <ProfileStack.Screen name={ADD_CAR_SCREEN} component={AddCarScreen} />
    </ProfileStack.Navigator>
  );
};

const Navigation = (props) => {
  /*const {isAuthenticated, isLoading, username, alerts, profileId, error} = props*/
  if (!props.isAuthenticatedOrLoading && !props.error) {
    props.onTryAutoSignup();
  }

  return (
    <NavigationContainer>
      {props.isAuthenticated ? (
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerComponent {...props} />}>
          <Drawer.Screen name={HOME_STACK} component={Events} />
          <Drawer.Screen name={PROFILE_STACK} component={Profile} />
        </Drawer.Navigator>
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
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
