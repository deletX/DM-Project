import {View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Badge, Colors} from "react-native-paper";
import * as React from "react";
import {connect} from "react-redux";

/**
 * Drawer hamburger Icon to open the drawer
 */
const DrawerIcon = (props) => {

    return (<View>
        <Icon
            name="menu"
            color={Colors.teal700}
            size={35}
            style={{marginRight: 20}}
            onPress={() => {
                props.navigation.toggleDrawer()
            }}
        />
        {props.unReadCount > 0 &&
        <Badge style={{position: "absolute", top: 2, right: 15, maxWidth: 25}}>{props.unReadCount}</Badge>}
    </View>)
}

const mapStateToProps = (state) => {
    return {
        unReadCount: state.notifications.unReadCount
    };
};

export default connect(mapStateToProps)(DrawerIcon);