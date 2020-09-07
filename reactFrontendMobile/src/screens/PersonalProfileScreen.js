import * as React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button, Colors, DataTable, Title} from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"
import {connect} from 'react-redux';
import {FUEL} from "../constants/constants";
import {ADD_CAR_SCREEN} from "../constants/screens";
import {ProfileHeader} from "../components/profile/ProfileHeader";
import {ProfileFeedbackReceived} from "../components/profile/ProfileFeedbackReceived";

/**
 * Car table with
 * - name column
 * - fuel column
 * - seats column
 * - consumption column
 *
 * Rows are to be set as children
 */
const CarTable = (props) => (
    <DataTable>
        <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Fuel</DataTable.Title>
            <DataTable.Title numeric>Seats</DataTable.Title>
            <DataTable.Title numeric>l/100km</DataTable.Title>
        </DataTable.Header>
        {props.children}
    </DataTable>
)

/**
 * Personal profile screen, that w.r.t. the standard ProfileScreen includes Car table with button to create or
 * edit/delete existing cars.
 */
const PersonalProfileScreen = (props) => {

    const cars = props.profile.carSet.map((car) => (
        <DataTable.Row key={car.id} onPress={() => props.navigation.navigate(ADD_CAR_SCREEN, {edit: true, car: car})}>
            <DataTable.Cell><Text style={styles.text}> {car.name}</Text></DataTable.Cell>
            <DataTable.Cell>{FUEL[car.fuel]}</DataTable.Cell>
            <DataTable.Cell numeric>{car.tot_avail_seats}</DataTable.Cell>
            <DataTable.Cell numeric>{car.consumption}</DataTable.Cell>
        </DataTable.Row>
    ))

    return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollViewContentContainerStyle}>
                <ProfileHeader profile={props.profile}/>
                <View style={styles.feedbackAndCarsContainer}>
                    <ProfileFeedbackReceived profile={props.profile}/>

                    <View style={styles.carContainer}>
                        <Title>
                            Cars
                        </Title>
                        <Button icon={() => <Icon name={"add-circle"} size={23} color={Colors.orange800}/>}
                                onPress={() => {
                                    props.navigation.navigate(ADD_CAR_SCREEN, {edit: false})
                                }}
                                color={Colors.orange800}
                                style={styles.addCarButton}
                        >
                            add car
                        </Button>
                    </View>

                    <CarTable>{cars}</CarTable>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    addCarButton: {position: "absolute", right: 0},
    carContainer: {flex: 0, flexDirection: 'row', marginTop: 10},
    feedbackAndCarsContainer: {width: "90%"},
    scrollViewContentContainerStyle: {alignItems: 'center'},
    text: {fontWeight: "bold", color: Colors.deepOrange700}
})

function mapStateToProps(state) {
    return {
        profile: state.profile
    };
}

export default connect(
    mapStateToProps,
)(PersonalProfileScreen);
