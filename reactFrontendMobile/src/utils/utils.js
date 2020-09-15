import AsyncStorage from '@react-native-community/async-storage'
import {EVENT_SCREEN, PROFILE_STACK} from "../constants/screens";
import {nominatimCoordinatesToAddressURL} from "../constants/apiurls";
import Toast from 'react-native-simple-toast';
import {Alert} from "react-native";
import moment from "moment";
import {getEventDetail} from "./api";

/**
 * Check authentication by looking for the token item inside AsyncStorage
 *
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    const token = AsyncStorage.getItem("token");
    if (token === undefined) {
        return false;
    } else {
        const expirationDate = new Date(AsyncStorage.getItem("expirationDate"));
        return expirationDate > new Date();
    }
};

/**
 * Updates the oldObject object changing given updateProperties
 *
 * @param {{}} oldObject
 * @param {{}} updatedProperties
 *
 * @return {{}} oldObject with properties listed in updatedProperties changed
 */
export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

/**
 * Return the object to be used as options in axios calls
 *
 * @param {string} content_type
 * @param {string} access_token
 * @param {{}} otherHeaders
 * @param {[{}]} otherOptions
 *
 * @return {{}} options including the header option correctly set
 */
export const headers = (content_type, access_token = null, otherHeaders = {}, otherOptions = {}) => {
    let headers = {
        headers: {
            "Content-type": content_type,
            ...otherHeaders
        },
        ...otherOptions
    };
    if (access_token != null) headers = {
        ...headers, headers: {...headers.headers, "Authorization": `Bearer ${access_token}`}
    };
    return headers
};

/**
 * Converts a raw string date in a more readable fashion, padding with '0' days, months, hours and minutes: dd/mm/yyyy hh:mm
 *
 * @param {{}} date
 *
 * @return formatted date
 */
export const dateFormatter = (date) => (
    moment(date).format("dddd D MMMM YYYY, HH:mm")
)

/**
 * Utility function that translate the nominatim response address into two substrings composed of the address elements.
 * In general:
 * - **Primary**: includes the road and house_number (if available)
 * - **Secondary**: includes town/hamlet/province/county/village and postcode information
 *
 * If the location is a province a county or a state _primary_ and _secondary_ may differ.
 *
 * @param position from nominatim
 *
 * @return {{secondary: string, primary: string}}
 */
export const nominatimToPrimarySecondary = (position) => {
    let primary = "";
    let secondary = "";
    let address = position.address

    if ("postcode" in address) {
        secondary += `${address.postcode} `
    }

    if ("house_number" in address) {
        primary = `${address.road}, ${address.house_number}`
        if ("hamlet" in address) {
            secondary += `${address.hamlet} `;
        }

        if ("town" in address) {
            secondary += `${address.town} `;
        } else if ("village" in address) {
            secondary += `${address.village} `;
        }
        if ("county" in address) {
            secondary += `${address.county}`;
        } else if ("province" in address) {
            secondary += `${address.province} `;
        }

    } else if ("road" in address) {
        primary = address.road
        if ("hamlet" in address) {
            secondary += `${address.hamlet} `;
        }

        if ("town" in address) {
            secondary += `${address.town} `;
        } else if ("village" in address) {
            secondary += `${address.village} `;
        }
        if ("county" in address) {
            secondary += `${address.county}`;
        } else if ("province" in address) {
            secondary += `${address.province} `;
        }
    } else if ("hamlet" in address) {
        primary = address.hamlet

        if ("town" in address) {
            secondary += `${address.town} `;
        } else if ("village" in address) {
            secondary += `${address.village} `;
        }
        if ("county" in address) {
            secondary += `${address.county}`;
        } else if ("province" in address) {
            secondary += `${address.province} `;
        }
    } else if ("town" in address) {
        primary = address.town
        if ("county" in address) {
            secondary += `${address.county}`;
        } else if ("province" in address) {
            secondary += `${address.province} `;
        }
    } else if ("village" in address) {
        primary = address.village
        if ("county" in address) {
            secondary += `${address.county}`;
        } else if ("province" in address) {
            secondary += `${address.province} `;
        }
    } else if ("county" in address) {
        primary = address.county;

        secondary += address.country;
    } else if ("province" in address) {
        primary = address.province;
        secondary += address.country;
    }

    return {primary, secondary}
}

/**
 * From a nominatim data to [address, position] couple
 *
 * @param item Nominatim response data got at {@link nominatimCoordinatesToAddressURL}
 *
 * @return {[string, string]} address, position
 */
export const selectItem = (item) => {
    let {primary, secondary} = nominatimToPrimarySecondary(item);
    let addr = (`${primary} ${secondary}`);
    let pos = (`SRID=4326;POINT (${item.lat} ${item.lon})`)
    return [addr, pos]
}

/**
 * From a position string (ex: "SRID=4326;POINT (<lat> <lon>)") to a lat, long couple
 *
 * @param {string} position
 * @param {boolean} shouldParseFloat If the return value should be float or not (default: true)
 *
 * @return {[number, number]|[string, string]}
 */
export const pridStringToLatLng = (position, shouldParseFloat = true) => {
    let latlng = position.split(' ')
    if (shouldParseFloat) {
        return [parseFloat(latlng[1].slice(1)), parseFloat(latlng[2].slice(0, -1))]
    } else {
        return [latlng[1].slice(1), latlng[2].slice(0, -1)]
    }
}

/**
 * Translate a notification url to the corresponding screen and its props.
 *
 * @param {string} url Of the notification
 *
 * @param {string} token
 */
export const URLtoScreenWithProps = async (url, token = "") => {
    let screenWithProps = {};
    const splitUrl = url.split('/');
    if (splitUrl[1] === "profiles") {
        screenWithProps["screen"] = PROFILE_STACK;
    } else {
        screenWithProps["screen"] = EVENT_SCREEN;
        let id = parseInt(splitUrl[2])
        await getEventDetail(id, token,
            (res) => {
                screenWithProps["props"] = {
                    id: id,
                    event: res.data,
                }
            },
            (err) => {

            })
    }
    return screenWithProps;
}

/**
 * Generates a callback that creates an Alert to cancel an action or do it.
 *
 * @param {function()} onPressYes
 * @param {boolean} cancelable
 * @return {function(): *}
 */
export const alertAreYouSure = (onPressYes, cancelable = true) => () => {
    Alert.alert(
        "Are you sure?",
        "There is no coming back",
        [
            {
                text: "No", style: 'cancel'
            },
            {
                text: "Yes", onPress: onPressYes
            }
        ],
        {cancelable: cancelable}
    )
}

/**
 * Creates the directions link, that will open google maps with the starting position, being my selected location
 * and waypoints other participant in the car
 *
 * @param {{}} participation
 * @param {{}} event
 * @param {{}} myCar
 * @return {string}
 */
export const createDirectionLink = (participation, event, myCar) => {
    let destination = pridStringToLatLng(event.destination, false).join(",")
    let waypoints = myCar.filter(item => (item.id !== participation.id)).map(item => pridStringToLatLng(item.starting_pos, false).join(",")).join("%7C")
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&waypoints=${waypoints}`
}

/**
 * Toast the given message and logs the error.
 *
 * @param {string} msg
 * @param error
 */
export const handleError = (msg, error) => {
    Toast.show(msg, Toast.LONG)
    console.log("handleError: ", error)
}

export const handleSuccess = (msg) => {
    Toast.show(msg, Toast.SHORT)
}

export const handleInfo = (msg) => {
    Toast.show(msg, Toast.LONG)
}