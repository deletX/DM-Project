import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const Logo = () => {
    return (
        <View>
            <Image
                style={{width: 125, height: 125}}
                source={require('./logo.png')}
            />
        </View>
    );
};

export default Logo
