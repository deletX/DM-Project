import * as React from 'react';
import {View, Text} from 'react-native';

const ProfileScreen = (props) => {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Profile Screen id:{props.route.params.profile.id}</Text>
        </View>
    );
};

export default ProfileScreen;
