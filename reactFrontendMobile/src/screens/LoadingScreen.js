import * as React from 'react';
import {View, Text} from "react-native"
import {ActivityIndicator, Colors} from "react-native-paper";
import {HOME_SCREEN, LOGIN_SCREEN} from "../constants/screens";

const LoadingScreen = (props) => {
    React.useEffect(() => {
        setTimeout(() => {
            if (props.isAuthenticated) {
                props.navigation.navigate(HOME_SCREEN)
            } else {
                props.navigation.navigate(LOGIN_SCREEN)
            }
        }, 5000)
    }, [props.navigation])
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator animating={true} color={Colors.red800} size="large"/>
        </View>
    );
}

export default LoadingScreen;