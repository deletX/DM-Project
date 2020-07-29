import React from 'react';
import {Avatar, Colors} from "react-native-paper";


const CustomAvatar = (props) => {
    return (
        (props.picture === null || props.picture === "") ? (
            <Avatar.Text
                label={`${props.firstName ? props.firstName[0] : ""}${props.lastName ? props.lastName[0] : ""}`.toUpperCase()}
                size={props.size ? props.size : 50}
                labelStyle={[{fontSize: 21, color: Colors.white}, props.labelStyle]}
                style={props.style}
            />
        ) : (
            <Avatar.Image source={{uri: props.picture === '' ? null : props.picture}}
                          size={props.size ? props.size : 50}
                          style={props.style}
            />

        )
    );
};

export default CustomAvatar;