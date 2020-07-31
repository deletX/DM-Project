import AsyncStorage from '@react-native-community/async-storage'
import {EVENT_SCREEN, HOME_SCREEN, PROFILE_SCREEN, PROFILE_STACK} from "./constants/screens";
import axios from "axios";
import {eventDetailURL, eventJoinURL, nominatimCoordinatesToAddressURL} from "./constants/apiurls";
import NativeToastAndroid from "react-native/Libraries/Components/ToastAndroid/NativeToastAndroid";
import {ToastAndroid} from "react-native";
import {participationEditURL} from "./constants/apiurls";

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

export const getNominatimInfo = async (latitude, longitude) => {
    //console.log("getNominatimInfo ", latitude, longitude);
    return axios.get(nominatimCoordinatesToAddressURL(latitude, longitude))
        .then((res) => {
                let payload = selectItem(res.data, latitude, longitude);
                console.log("getNominatimInfo ", payload);
                return payload;
            }
        )
        .catch((error) => {
            console.log("An error occurred while retrieving your location");
        })


}

export const postJoinedEvent = async (eventID, token, startingAddress, startingPos, carID, navigation) => {
    axios
        .post(
            eventJoinURL(eventID),
            {
                starting_address: startingAddress,
                starting_pos: startingPos,
                car: carID
            },
            headers('application/json', token)
        )
        .then(res => {
                console.log("Joined successfully");
                navigation.navigate(HOME_SCREEN, {refresh: true});

            }
        )
        .catch(err => {
                console.log("An error occurred while joining", err)
            }
        )
}

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

export const deleteLeaveEvent = async (eventID, token, participationID, reload) => {
    axios
        .delete(
            participationEditURL(eventID, participationID),
            headers('application/json', token)
        )
        .then(res => {
            console.log("Successfully left the event");
            reload();

        })
        .catch(err => {
            ToastAndroid.show("Something went wrong while leaving ", ToastAndroid.SHORT);
            console.log("Something went wrong while leaving ", err)
        })

}
export const pridStringToLatLng = (position, shouldParseFloat = true) => {
    let latlng = position.split(' ')
    if (shouldParseFloat) {
        return [parseFloat(latlng[1].slice(1)), parseFloat(latlng[2].slice(0, -1))]
    } else {
        return [latlng[1].slice(1), latlng[2].slice(0, -1)]
    }
}

/**
 *
 * @param {string} url
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
                // history.push(home)
                ToastAndroid.show("Error while retrieving event", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
                // addAlert("An error occurred while retrieving event data",)
            })

    }
    return screenWithProps;
}