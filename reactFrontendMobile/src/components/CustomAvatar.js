import React from 'react';
import {Avatar, Colors} from "react-native-paper";


const CustomAvatar = (props) => {
    console.log(`CustomAvatar - picture: ${props.picture}`)
    if (props.firstName !== undefined) console.log(`, firstName[0]lastName[0]Upp: ${`${props.firstName[0]}${props.lastName[0]}`.toUpperCase()}\`)`)
    return (
        (props.picture === null || props.picture === "") ? (
            <Avatar.Text label={`${props.firstName[0]}${props.lastName[0]}`.toUpperCase()} size={50}
                         labelStyle={{fontSize: 21, color: Colors.white}}/>
        ) : (
            <Avatar.Image source={{uri: props.picture === '' ? null : props.picture}} size={50}/>

        )
    );
};

export default CustomAvatar;