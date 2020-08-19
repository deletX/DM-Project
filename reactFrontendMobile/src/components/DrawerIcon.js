import {View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Badge, Colors} from "react-native-paper";
import * as React from "react";
import {authCheckState} from "../actions/authActions";
import {connect} from "react-redux";

const DrawerIcon = ({navigation, notifications}) => {
    const unRead = notifications.filter((notification) => !notification.read)
    console.log(notifications)
    return (<View>
        <Icon
            name="menu"
            color={Colors.teal700}
            size={35}
            style={{marginRight: 20}}
            onPress={() => {
                navigation.toggleDrawer()
            }}
        />
        {unRead.length > 0 &&
        <Badge style={{position: "absolute", top: 2, right: 15, maxWidth: 25}}>{unRead.length}</Badge>}
    </View>)
}

const mapStateToProps = (state) => {
    return {
        notifications: state.notifications.notifications
    };
};

export default connect(mapStateToProps)(DrawerIcon);