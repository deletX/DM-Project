import {ALBERTO_IP, COMPUTER} from "./virtual-box";

/**
 * Google API Client ID
 * @type {string}
 */
export const CLIENT_ID = "283420556311-30r26g3mtt5odkqmit6u7onam3qrul16.apps.googleusercontent.com";

/**
 * Google API Client secret
 * @type {string}
 */
export const CLIENT_SECRET = "KsSTbOaPDbxEbEGqkcyWl3-v";

/**
 * Application Client ID
 * @type {string}
 */
export const APP_CLIENTID = "4mOLHPfJL0zueHOlawvJXsdnImpjOv3PmLdmm3NT";

/**
 * Application Client secret
 * @type {string}
 */
export const APP_SECRET = "FW4dYuZsLmE6PQHk7qrPAc4shQhdx2hknqNOh58XO3JQ6PFI8um2z6wyJubxF6hKNOOOJfZUQ67jm5ApN5HJioq4XsNAGSbCLiQZqrqfo6jiy67ddpvMOl3Be8SATFSL";

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

