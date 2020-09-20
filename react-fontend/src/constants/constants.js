import {ALBERTO_IP, COMPUTER} from "./virtual-box";

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
 * server url either:
 * - [Alberto's Address]{@link ALBERTO_IP}
 * - `http://192.168.1.27:8000/`
 *
 * @type {string}
 */
export const serverURL =
    COMPUTER === 'alberto'
        ? ALBERTO_IP
        : 'http://192.168.1.27:8000/';

/**
 * Event statuses
 * @type {string[]}
 */
export const status = [
    'Joinable',
    'Computing',
    'Computed'
];

/**
 * Landing page background
 *
 * @type {string} url
 */
export const landingpageback = serverURL + "media/landingpageback.jpg"

/**
 * Landing page mock profile picture
 *
 * @param {number} num
 *
 * @return {string} url
 */
export const landingpageProfile = (num) => (serverURL + `media/profile_pictures/mock${num}.jpg`)

/**
 * Landing page mock event picture
 *
 * @param {number} num
 *
 * @return {string} url
 */
export const landingpageEvent = (num) => (serverURL + `media/event_pictures/mock${num}.jpg`)

/**
 * Default event picture
 * @type {string}
 */
export const defaultEventPic = serverURL + "media/default-event.jpg"

