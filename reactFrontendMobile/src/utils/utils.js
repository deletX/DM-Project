import AsyncStorage from '@react-native-community/async-storage'
import {EVENT_SCREEN, PROFILE_STACK} from "../constants/screens";
import axios from "axios";
import {eventDetailURL, nominatimCoordinatesToAddressURL} from "../constants/apiurls";
import Toast from 'react-native-simple-toast';

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
 * @param {number} latitude
 * @param {number} longitude
 *
 * @return {[string, string]} address, position
 */
export const selectItem = (item, latitude, longitude) => {
    let {primary, secondary} = nominatimToPrimarySecondary(item);
    let lat, lon;
    let addr = (`${primary} ${secondary}`);
    let pos = (`SRID=4326;POINT (${item.lat} ${item.lon})`)
    if (latitude !== undefined) {
        lat = (parseFloat(item.lat))
    } else {
        lat = (item.lat)
    }

    if (longitude !== undefined) {
        lon = (lon);
    } else {
        lon = (item.lon);
    }

    return [addr, pos]
}

/**
 * From a position string (ex: "SRID=4326;POINT (<lat> <lon>)") to a lat, long couble
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
    const splittedUrl = url.split('/');
    if (splittedUrl[1] === "profiles") {
        screenWithProps["screen"] = PROFILE_STACK;
    } else {
        screenWithProps["screen"] = EVENT_SCREEN;
        let id = parseInt(splittedUrl[2])
        await axios
            .get(
                eventDetailURL(id),
                headers('application/json', token)
            )
            .then(res => {
                screenWithProps["props"] = {
                    id: id,
                    event: res.data,
                }
            })
            .catch(err => {
                handleError("Something went wrong while retrieving event [003]", err)
            })

    }
    return screenWithProps;
}

/**
 * Toast the given message and logs the error.
 *
 * @param {string} msg
 * @param error
 */
export const handleError = (msg, error) => {
    Toast.show(msg)
    console.log(error)
}