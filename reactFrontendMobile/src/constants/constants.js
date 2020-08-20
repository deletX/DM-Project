import {COMPUTER, ALBERTO_IP} from './virtual-box';

/**
 * Google Client ID
 *
 * @type {string}
 */
export const CLIENT_ID =
    '283420556311-30r26g3mtt5odkqmit6u7onam3qrul16.apps.googleusercontent.com';

/**
 * Google Client Secret
 *
 * @type {string}
 */
export const CLIENT_SECRET = 'KsSTbOaPDbxEbEGqkcyWl3-v';

/**
 * DMProject Oauth Client Id
 * @type {string}
 */
export const APP_CLIENTID = '4mOLHPfJL0zueHOlawvJXsdnImpjOv3PmLdmm3NT';

/**
 * DMProject Oauth Client secret
 *
 * @type {string}
 */
export const APP_SECRET =
    'FW4dYuZsLmE6PQHk7qrPAc4shQhdx2hknqNOh58XO3JQ6PFI8um2z6wyJubxF6hKNOOOJfZUQ67jm5ApN5HJioq4XsNAGSbCLiQZqrqfo6jiy67ddpvMOl3Be8SATFSL';

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
