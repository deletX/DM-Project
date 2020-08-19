import React from 'react';
import {Image, View} from 'react-native';

/**
 * DMProject Logo
 */
const Logo = () => {
    return (
        <View>
            <Image
                style={{width: 125, height: 125}}
                source={require('./assets/logo.png')}
            />
        </View>
    );
};

export default Logo
