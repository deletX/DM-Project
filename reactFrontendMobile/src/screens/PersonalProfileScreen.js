import * as React from 'react';
import {ScrollView, View, Text} from 'react-native';
import {Headline, Title, Caption, DataTable, Button, Colors} from "react-native-paper"
import CustomAvatar from "../components/CustomAvatar";
import FeedbackListComponent from "../components/FeedbackListComponent";
import Icon from "react-native-vector-icons/MaterialIcons"
import {connect} from 'react-redux';
import StarRating from "react-native-star-rating";
import {FUEL} from "../constants/constants";
import {ADD_CAR_SCREEN} from "../constants/screens";

const PersonalProfileScreen = (props) => {
    console.log(props.profile)
    const feedbackReceived = props.profile.receivedFeedback.map((feedback) => (
        <FeedbackListComponent
            navigation={props.navigation}
            feedback={feedback}
            key={feedback.id}
        />
    ))

    const cars = props.profile.carSet.map((car) => (
        <DataTable.Row key={car.id} onPress={() => props.navigation.navigate(ADD_CAR_SCREEN, {edit: true, car: car})}>
            <DataTable.Cell><Text
                style={{fontWeight: "bold", color: Colors.deepOrange700}}>{car.name}</Text></DataTable.Cell>
            <DataTable.Cell>{FUEL[car.fuel]}</DataTable.Cell>
            <DataTable.Cell numeric>{car.tot_avail_seats}</DataTable.Cell>
            <DataTable.Cell numeric>{car.consumption}</DataTable.Cell>
        </DataTable.Row>
    ))

    return (
        <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center'}}>
            <CustomAvatar picture={props.profile.picture} firstName={props.profile.user.first_name}
                          lastName={props.profile.user.last_name} size={100} labelStyle={{fontSize: 50}}
                          style={{marginTop: 20}}/>
            <Caption style={{marginTop: 5}}>{props.profile.user.username}</Caption>
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
                <Title style={{marginTop: 10}}>
                    Feedback you received
                </Title>
                <ScrollView style={{maxHeight: 300}}>
                    {feedbackReceived}
                </ScrollView>

                <View style={{flex: 0, flexDirection: 'row'}} style={{marginTop: 10}}>
                    <Title>
                        Cars
                    </Title>
                    <Button icon={() => <Icon name={"add-circle"} size={23} color={Colors.orange800}/>}
                            onPress={() => {
                                props.navigation.navigate(ADD_CAR_SCREEN, {edit: false})
                            }}
                            color={Colors.orange800}
                            style={{position: "absolute", right: 0}}
                    >add car</Button>
                </View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title>Fuel</DataTable.Title>
                        <DataTable.Title numeric>Seats</DataTable.Title>
                        <DataTable.Title numeric>l/100km</DataTable.Title>
                    </DataTable.Header>
                    {cars}
                </DataTable>
            </View>
        </ScrollView>
    );
};

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
