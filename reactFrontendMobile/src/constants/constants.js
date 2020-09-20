import {ALBERTO_IP, COMPUTER} from './virtual-box';

/**
 * Google API Client ID
 * @type {string}
 */
export const CLIENT_ID = "google_client_id";

/**
 * Google API Client secret
 * @type {string}
 */
export const CLIENT_SECRET = "google_client_secret";

/**
 * Application Client ID
 * @type {string}
 */
export const APP_CLIENTID = "app_client_id";

/**
 * Application Client secret
 * @type {string}
 */
export const APP_SECRET = "app_client_secret";

/**
 * server IP (for dev purposes right now)
 *
 * @type {string}
 */
export const serverURL =
    COMPUTER === 'alberto' ? ALBERTO_IP : 'http://192.168.1.27:8000/';

/**
 * Joinable number value
 *
 * @type {number}
 */
export const JOINABLE = 0

/**
 * Computing number value
 *
 * @type {number}
 */
export const COMPUTING = 1

/**
 * Computed number value
 *
 * @type {number}
 */
export const COMPUTED = 2

/**
 * Fuel values for conversion
 *
 * @type {string[]}
 */
export const FUEL = ["Error", "Petrol", "Diesel", "Gas", "Electric"]
