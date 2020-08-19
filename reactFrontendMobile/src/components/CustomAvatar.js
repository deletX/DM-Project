import React from 'react';
import {Avatar, Colors} from "react-native-paper";


/**
 * If the **picture** is defined a regular Avatar image is shown.
 * Otherwise we use the **firstName** and **lastName** props to make a Avatar.Text with the capital initials
 */
const CustomAvatar = (props) => {
    return (
        (props.picture === null || props.picture === "") ? (
            <Avatar.Text
                label={`${props.firstName ? props.firstName[0] : ""}${props.lastName ? props.lastName[0] : ""}`.toUpperCase()}
                size={props.size ? props.size : 50}
                labelStyle={[styles.labelStyle, props.labelStyle]}
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

const styles = StyleSheet.create({
    labelStyle: {
        fontSize: 21,
        color: Colors.white
    }
})

export default CustomAvatar;