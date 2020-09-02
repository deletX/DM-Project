import {useLocation} from "react-router";


export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
        return false;
    } else {
        const expirationDate = new Date(localStorage.getItem("expirationDate"));
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
    return [latlng[1].slice(1), latlng[2].slice(0, -1)]
}

export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export const handleError = (enqueueSnackbar, message, error) => {
    enqueueSnackbar(message, {variant: 'error'});
    console.log(error);
}

export const handleSuccess = (enqueueSnackbar, message) => {
    enqueueSnackbar(message, {variant: 'success'});
}

export const handleInfo = (enqueueSnackbar, message) => {
    enqueueSnackbar(message, {variant: 'info'});
}

export const handleWarning = (enqueueSnackbar, message) => {
    enqueueSnackbar(message, {variant: 'warning'});
}