import * as React from 'react';
import {ScrollView, View, Text} from 'react-native';
import {Headline, Title, Caption} from "react-native-paper"
import CustomAvatar from "../components/CustomAvatar";

const PersonalProfileScreen = (props) => {
    return (
        <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center'}}>
            <CustomAvatar picture={props.profile.picture} firstName={props.profile.user.first_name}
                          lastName={props.profile.user.last_name} size={100} labelStyle={{fontSize: 50}}
                          style={{marginTop: 20}}/>
            <Caption style={{marginTop: 5}}>@{props.profile.user.username}</Caption>
            <StarRating
                halfStarEnabled
                rating={props.profile.average_vote ? props.profile.average_vote : 0}
                starSize={30}
                disabled={true}
                fullStarColor={"#d6a000"}
                containerStyle={{width: "40%", marginTop: 5, marginBottom: 10}}
                emptyStarColor={props.profile.average_vote ? "#808080" : "#bbbbbb"}
            />

            <View style={{
                flex: 0,
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: "80%",
                marginTop: 0,
                marginBottom: 5
            }}>
                <Headline>{props.profile.user.first_name}</Headline>
                <Headline>{props.profile.user.last_name}</Headline>
            </View>
            <View style={{width: "90%"}}>
                <Title>
                    Feedback you received
                </Title>

            </View>

        </ScrollView>
    );
};

import {connect} from 'react-redux';
import StarRating from "react-native-star-rating";

function mapStateToProps(state) {
    return {
        profile: state.profile
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
)(PersonalProfileScreen);
