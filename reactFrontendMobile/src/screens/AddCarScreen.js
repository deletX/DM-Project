import * as React from 'react';
import {Alert, ScrollView, StyleSheet, View} from "react-native"
import {Button, Caption, Colors, HelperText, RadioButton, TextInput} from "react-native-paper";
import {FUEL} from "../constants/constants";
import {connect} from 'react-redux';
import {createCar, deleteCar, updateCar} from "../actions/profileActions";

/**
 * Text input for car name and helper text
 */
const CarName = (props) => (
    <>
        <TextInput
            label="Name"
            value={props.value}
            placeholder="My Awesome car"
            onChangeText={props.onChangeText}
            onBlur={props.onBlur}
        />
        <HelperText visible={props.visible} type="error">
            Car name cannot be empty
        </HelperText>
    </>
)

/**
 * Radio Button and caption for fuel type selection
 */
const CarFuelType = (props) => (
    <>
        <Caption style={{marginTop: 15}}>Select the fuel type:</Caption>
        <RadioButton.Group onValueChange={props.onValueChange} value={props.value}>
            <RadioButton.Item style={styles.radioButton} label={FUEL[1]} value={1}/>
            <RadioButton.Item style={styles.radioButton} label={FUEL[2]} value={2}/>
            <RadioButton.Item style={styles.radioButton} label={FUEL[3]} value={3}/>
            <RadioButton.Item style={styles.radioButton} label={FUEL[4]} value={4}/>
        </RadioButton.Group>
    </>
)

/**
 * Text input and helper text for car seats
 */
const CarSeats = (props) => (
    <>
        <TextInput
            label="Seats"
            value={props.value}
            placeholder="5"
            onChangeText={props.onChangeText}
            onBlur={props.onBlur}
            keyboardType={'numeric'}
            style={styles.textInput}
        />
        <HelperText>From 2 seats to 9 are allowed (driver included)</HelperText>
    </>
)

/**
 * Text input and helper text for consumption
 */
const CarConsumption = (props) => (
    <>
        <TextInput
            label="Consumption"
            value={props.value}
            placeholder="10"
            onChangeText={props.onChangeText}
            onBlur={props.onBlur}
            keyboardType={'numeric'}
            style={styles.textInput}
        />
        <HelperText>A minimum of 3 l/100km is allowed</HelperText>
    </>

)

/**
 * Add and edit car screen:
 *  - name {@link CarName}
 *  - Fuel Type {@link CarFuelType}
 *  - seats {@link CarSeats}
 *  - consumption {@link CarConsumption}
 *
 *  Button included with alert if editing
 */
const AddCarScreen = (props) => {
    const [name, setName] = React.useState(props.route.params.edit ? props.route.params.car.name : "")
    const [fuel, setFuel] = React.useState(props.route.params.edit ? props.route.params.car.fuel : 1)
    const [seats, setSeats] = React.useState(props.route.params.edit ? props.route.params.car.tot_avail_seats : 4)
    const [consumption, setConsumption] = React.useState(props.route.params.edit ? props.route.params.car.consumption : 10)
    const [nameError, setNameError] = React.useState(false)

    return (
        <ScrollView>
            <View style={styles.mainView}>
                <CarName
                    value={name}
                    onChangeText={(text) => {
                        setName(text)
                        if (text.length === 0) setNameError(true)
                        if (nameError && text.length > 0) setNameError(false)
                    }}
                    onBlur={(text) => {
                        if (name.length === 0) setNameError(true)
                    }} visible={nameError}
                />

                <CarFuelType onValueChange={(fuel) => setFuel(fuel)} value={fuel}/>

                <CarSeats
                    value={seats.toString()}
                    onChangeText={(text) => {
                        setSeats(text)
                    }}
                    onBlur={() => {
                        let _seats = Math.round(parseFloat(seats))
                        setSeats(_seats < 2 || isNaN(_seats) ? 2 : _seats > 9 ? 9 : _seats)
                    }}
                />

                <CarConsumption
                    value={consumption.toString()}
                    onChangeText={(text) => {
                        setConsumption(text)
                    }}
                    onBlur={() => {
                        let _consumption = (parseFloat(consumption))
                        setConsumption(_consumption < 3 || isNaN(_consumption) ? 3 : _consumption)
                    }}
                />

                <View style={styles.buttonView}>
                    {props.route.params.edit &&
                    <Button
                        icon={"delete"}
                        color={Colors.red800}
                        onPress={() => {
                            Alert.alert(
                                "Are you sure?",
                                "There is no coming back",
                                [
                                    {
                                        text: "No", style: 'cancel'
                                    },
                                    {
                                        text: "Yes",
                                        onPress: () => {
                                            props.deleteCar(props.route.params.car.id)
                                            props.navigation.goBack()
                                        }
                                    }
                                ]
                            )

                        }}>
                        Delete
                    </Button>
                    }
                    <Button
                        icon={"content-save"}
                        onPress={() => {
                            if (props.route.params.edit) {
                                Alert.alert(
                                    "Are you sure?",
                                    "There is no coming back",
                                    [
                                        {
                                            text: "No", style: 'cancel'
                                        },
                                        {
                                            text: "Yes",
                                            onPress: () => {
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
                        }}>
                        Save
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    buttonView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    mainView: {
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15
    },
    textInput: {marginTop: 15},
    radioButton: {height: 40},


})

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