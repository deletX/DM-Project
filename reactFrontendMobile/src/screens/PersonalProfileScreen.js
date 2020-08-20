import * as React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Button, Colors, DataTable, Title} from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"
import {connect} from 'react-redux';
import {FUEL} from "../constants/constants";
import {ADD_CAR_SCREEN} from "../constants/screens";
import {ProfileHeader} from "../components/profile/ProfileHeader";
import {ProfileFeedbackReceived} from "../components/profile/ProfileFeedbackReceived";

const PersonalProfileScreen = (props) => {

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
            <ProfileHeader profile={props.profile}/>
            <View style={{width: "90%"}}>
                <ProfileFeedbackReceived profile={props.profile}/>

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


export default connect(
    mapStateToProps,
)(PersonalProfileScreen);
