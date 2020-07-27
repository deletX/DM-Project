import React from 'react';
import {Avatar} from "react-native-paper";


const CustomAvatar = (props) => {
    return (
        (props.picture !== null || props.picture !== "") ? (
            <Avatar.Image source={{uri: props.picture === '' ? null : props.picture}} size={50} style={props.style}/>
        ) : (
            <Avatar.Text label={`${props.firstName[0]}${props.lastName[0]}`.toUpperCase()} size={50}
                         labelStyle={[{fontSize: 21}, props.labelStyle]} style={props.style}/>
        )
    );
};

export default CustomAvatar;