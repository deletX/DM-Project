import {useLocation} from "react-router";

/**
 * True if the there is a not expired token false otherwise
 *
 * @return {boolean}
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
        return false;
    } else {
        const expirationDate = new Date(localStorage.getItem("expirationDate"));
        return expirationDate > new Date();
    }
};

/**
 * Returns a new object with the `updateproperties` changed
 *
 * @param {{}} oldObject
 * @param {{}} updatedProperties
 */
export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

/**
 * return headers and other options for axios calls
 *
 * @param {string} content_type
 * @param {string} access_token
 * @param {{}} otherHeaders
 * @param {{}} otherOptions
 *
 * @return {{headers: {"Content-type": *}}}
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
    `${(date.getDate() < 10 ? '0' : '') + date.getDate()}/${date.getMonth() < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getFullYear()} ${(date.getHours() < 10 ? '0' : '') + date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`
)



/**
 * Converts a nominatim position object into a position and address string
 *
 * @param {{}} position
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
 * From PRID string (i.e. stored Points) to lat lng couple
 *
 * @param position
 *
 * @return {[string, string]}
 */
export const pridStringToLatLng = (position) => {
    let latlng = position.split(' ')
    return [latlng[1].slice(1), latlng[2].slice(0, -1)]
}

/**
 * Custom hook to retrieve query parameters
 *
 * @return {URLSearchParams}
 */
export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

/**
 * Custom error handling function.
 *
 * Error snackbar is shown and error logged.
 *
 * @param {enqueueSnackbar} enqueueSnackbar
 * @param {string} message
 * @param {Error} error
 */
export const handleError = (enqueueSnackbar, message, error) => {
    enqueueSnackbar(message, {variant: 'error'});
    console.log("handleError: ", error);
}

/**
 * Custom success handling function.
 *
 * @param {enqueueSnackbar} enqueueSnackbar
 * @param {string} message
 */
export const handleSuccess = (enqueueSnackbar, message) => {
    enqueueSnackbar(message, {variant: 'success', autoHideDuration: 5000});
}

/**
 * Custom info handling function
 *
 * @param {enqueueSnackbar} enqueueSnackbar
 * @param {string} message
 */
export const handleInfo = (enqueueSnackbar, message) => {
    enqueueSnackbar(message, {variant: 'info', autoHideDuration: 5000});
}

/**
 * Custom warning handling function.
 *
 * @param {enqueueSnackbar} enqueueSnackbar
 * @param {string} message
 */
export const handleWarning = (enqueueSnackbar, message) => {
    enqueueSnackbar(message, {variant: 'warning', autoHideDuration: 5000});
}