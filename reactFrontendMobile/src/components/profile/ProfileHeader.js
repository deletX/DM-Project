import CustomAvatar from "../CustomAvatar";
import {Caption, Headline} from "react-native-paper";
import StarRating from "react-native-star-rating";
import {StyleSheet, View} from "react-native";
import * as React from "react";

/**
 * Profile header with Avatar {@link CustomAvatar}, username, average rating and full name
 */
export const ProfileHeader = (props) => (
    <>
        <CustomAvatar picture={props.profile.picture}
                      firstName={props.profile.user.first_name}
                      lastName={props.profile.user.last_name}
                      size={100} labelStyle={{fontSize: 50}}
                      style={{marginTop: 20}}/>
        <Caption style={{marginTop: 5}}>{props.profile.user.username}</Caption>
        <StarRating
            halfStarEnabled
            rating={props.profile.average_vote ? props.profile.average_vote : 0}
            starSize={30}
            disabled={true}
            fullStarColor={"#d6a000"}
            containerStyle={style.starContainer}
            emptyStarColor={props.profile.average_vote ? "#808080" : "#bbbbbb"}
        />
        <View style={style.name}>
            <Headline>{props.profile.user.first_name}</Headline>
            <Headline>{props.profile.user.last_name}</Headline>
        </View>
    </>
)

const style = StyleSheet.create({
    name: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: "80%",
        marginTop: 0,
        marginBottom: 5
    },
    starContainer: {
        width: "40%",
        marginTop: 5,
        marginBottom: 10
    }
})