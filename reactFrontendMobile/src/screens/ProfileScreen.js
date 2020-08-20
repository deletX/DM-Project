import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {ProfileHeader} from "../components/profile/ProfileHeader";
import {ProfileFeedbackReceived} from "../components/profile/ProfileFeedbackReceived";

const ProfileScreen = (props) => {
    const profile = props.route.params.profile;
    return (
        <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center'}}>
            <ProfileHeader profile={profile}/>
            <View style={{width: "90%"}}>
                <ProfileFeedbackReceived profile={profile}/>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;
