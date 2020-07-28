import AsyncStorage from '@react-native-community/async-storage'
import {EVENT_SCREEN, PROFILE_SCREEN} from "./constants/screens";
import axios from "axios";
import {eventDetailURL} from "./constants/apiurls";
import NativeToastAndroid from "react-native/Libraries/Components/ToastAndroid/NativeToastAndroid";
import {ToastAndroid} from "react-native"

export const isAuthenticated = () => {
    const token = AsyncStorage.getItem("token");
    if (token === undefined) {
        return false;
    } else {
        const expirationDate = new Date(AsyncStorage.getItem("expirationDate"));
        return expirationDate > new Date();
    }
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

/**
 *
 * @param {string}content_type
 * @param {string}access_token
 * @param {{}}otherHeaders
 * @param otherOptions
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


export const pridStringToLatLng = (position) => {
    let latlng = position.split(' ')
    return [parseFloat(latlng[1].slice(1)), parseFloat(latlng[2].slice(0, -1))]
}

/**
 *
 * @param {string} url
 * @param {string} token
 */
export const URLtoScreenWithProps = async (url, token = "") => {
    let screenWithProps = {};
    const splittedUrl = url.split('/');
    if (splittedUrl[1] === "profile") {
        screenWithProps["screen"] = PROFILE_SCREEN;
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
                // history.push(home)
                ToastAndroid.show("Error while retrieving event", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
                // addAlert("An error occurred while retrieving event data",)
            })

    }
    return screenWithProps;
}