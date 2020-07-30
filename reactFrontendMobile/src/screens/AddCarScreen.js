import * as React from 'react';
import {ScrollView, View, Text, Alert} from "react-native"
import {TextInput, RadioButton, HelperText, Caption, Button, Colors} from "react-native-paper";
import {FUEL} from "../constants/constants";
import Icon from "react-native-vector-icons/MaterialIcons"
import {connect} from 'react-redux';
import {createCar, deleteCar, updateCar} from "../actions/profileActions";

const AddCarScreen = (props) => {
    const [name, setName] = React.useState(props.route.params.edit ? props.route.params.car.name : "")
    const [fuel, setFuel] = React.useState(props.route.params.edit ? props.route.params.car.fuel : 1)
    const [seats, setSeats] = React.useState(props.route.params.edit ? props.route.params.car.tot_avail_seats : 4)
    const [consumption, setConsumption] = React.useState(props.route.params.edit ? props.route.params.car.consumption : 10)
    const [nameError, setNameError] = React.useState(false)
    return (
        <ScrollView>
            <View style={{
                marginTop: 15, marginLeft: 15, marginRight: 15
            }}>
                <TextInput
                    label="Name"
                    value={name}
                    placeholder="My Awesome car"
                    onChangeText={(text) => {
                        setName(text)
                        if (text.length === 0) setNameError(true)
                        if (nameError && text.length > 0) setNameError(false)
                    }}
                    onBlur={(text) => {
                        if (name.length === 0) setNameError(true)
                    }}
                />
                <HelperText visible={nameError} type="error">
                    Car name cannot be empty
                </HelperText>
                <Caption style={{marginTop: 15}}>Select the fuel type:</Caption>
                <RadioButton.Group onValueChange={(fuel) => setFuel(fuel)} value={fuel}>
                    <RadioButton.Item style={{height: 40}} label={FUEL[1]} value={1}/>
                    <RadioButton.Item style={{height: 40}} label={FUEL[2]} value={2}/>
                    <RadioButton.Item style={{height: 40}} label={FUEL[3]} value={3}/>
                    <RadioButton.Item style={{height: 40}} label={FUEL[4]} value={4}/>
                </RadioButton.Group>
                <TextInput
                    label="Seats"
                    value={seats.toString()}
                    placeholder="5"
                    onChangeText={(text) => {
                        setSeats(text)
                    }}
                    onBlur={() => {
                        let _seats = Math.round(parseFloat(seats))
                        setSeats(_seats < 2 || isNaN(_seats) ? 2 : _seats > 9 ? 9 : _seats)
                    }}
                    keyboardType={'numeric'}
                    style={{marginTop: 15}}
                />
                <HelperText>From 2 seats to 9 are allowed (driver included)</HelperText>
                <TextInput
                    label="Consumption"
                    value={consumption.toString()}
                    placeholder="10"
                    onChangeText={(text) => {
                        setConsumption(text)
                    }}
                    onBlur={() => {
                        let _consumption = (parseFloat(consumption))
                        setConsumption(_consumption < 3 || isNaN(_consumption) ? 3 : _consumption)
                    }}
                    keyboardType={'numeric'}
                    style={{marginTop: 15}}
                />
                <HelperText>A minimum of 3 l/100km is allowed</HelperText>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    {props.route.params.edit &&
                    <Button icon={"delete"} color={Colors.red800} onPress={() => {
                        Alert.alert(
                            "Are you sure?",
                            "There is no coming back",
                            [
                                {text: "No", style: 'cancel'},
                                {
                                    text: "Yes", onPress: () => {
                                        props.deleteCar(props.route.params.car.id)
                                        props.navigation.goBack()
                                    }
                                }
                            ]
                        )
                    }}>Delete</Button>
                    }
                    <Button icon={"content-save"} onPress={() => {
                        if (props.route.params.edit) {
                            Alert.alert(
                                "Are you sure?",
                                "There is no coming back",
                                [
                                    {text: "No", style: 'cancel'},
                                    {
                                        text: "Yes", onPress: () => {
                                            props.editCar(props.route.params.car.id, name, fuel, seats, consumption)
                                            props.navigation.goBack()
                                        }
                                    }
                                ]
                            )
                        } else {
                            if (name.length === 0) {
                                setNameError(true)
                            } else {
                                props.createCar(name, fuel, seats, consumption)
                                props.navigation.goBack()
                            }
                        }
                    }}>Save</Button>
                </View>
            </View>
        </ScrollView>
    );
};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        deleteCar: (id) => dispatch(deleteCar(id)),
        editCar: (id, name, fuel, seats, consumption) => dispatch(updateCar(id, name, seats, fuel, consumption)),
        createCar: (name, fuel, seats, consumption) => dispatch(createCar(name, seats, fuel, consumption)),
    };
}


export default connect(
    mapStateToProps, mapDispatchToProps
)(AddCarScreen);