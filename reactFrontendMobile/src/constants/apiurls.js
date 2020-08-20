import {serverURL} from "./constants";

/**
 * Base API URL
 * @type {string}
 */
let apiBaseUrl = serverURL + 'api/v0.1/';

/**
 * events/?joined=<joinable>&joined=<joined>&owned=<owned>
 *
 * @param {boolean} joinable
 * @param {boolean} joined
 * @param {boolean} owned
 *
 * @return {string}
 */
export const eventListURL = (joinable = true, joined = true, owned = false) => (apiBaseUrl + `events/?joined=${joined}&joinable=${joinable}&owned=${owned}`);

/**
 * events/<eventPk>
 *
 * @param {number} eventPk
 *
 * @return {string}
 */
export const eventDetailURL = (eventPk) => (`${eventCreateURL()}${eventPk}/`);

/**
 * events/<eventPk>/participants/
 *
 * @param {number} eventPk
 *
 * @return {string}
 */
export const eventJoinURL = (eventPk) => (`${eventDetailURL(eventPk)}participants/`);

/**
 * https://nominatim.openstreetmap.org/reverse/?lat=<latitude>&lon=<longitude>&format=json&addressdetails=1
 *
 * @param {number} latitude
 * @param {number} longitude
 *
 * @return {string}
 */
export const nominatimCoordinatesToAddressURL = (latitude, longitude) => (`https://nominatim.openstreetmap.org/reverse/?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);

/**
 * events/<eventPk>/run/
 *
 * @param {number} eventPk
 *
 * @return {string}
 */
export const eventRunURL = (eventPk) => (`${eventDetailURL(eventPk)}run/`);

/**
 * current-profile/
 *
 * @return {string}
 */
export const currentProfileURL = () => (apiBaseUrl + 'current-profile/');

/**
 * auth/convert-token
 *
 * @return {string}
 */
export const convertTokenURL = () => (apiBaseUrl + 'auth/convert-token');

/**
 * auth/token
 *
 * @return {string}
 */
export const tokenURL = () => (apiBaseUrl + 'auth/token');

/**
 * signup/
 *
 * @return {string}
 */
export const signupURL = () => (apiBaseUrl + 'signup/');

/**
 * profiles/<profilePk>/
 *
 * @param {number} profilePk
 *
 * @return {string}
 */
export const profilesURL = (profilePk) => (apiBaseUrl + `profiles/${profilePk}/`);

/**
 * profile/<profilePk>/cars/
 *
 * @param {number} profilePk
 *
 * @return {string}
 */
export const carsListURL = (profilePk) => (`${profilesURL(profilePk)}cars/`);

/**
 * profile/<profilePk>/cars/<carPk>/
 *
 * @param {number} profilePk
 * @param {number} carPk
 *
 * @return {string}
 */
export const carsDetailURL = (profilePk, carPk) => (`${carsListURL(profilePk)}${carPk}/`);

/**
 * events/<eventPk>/participants/<participantPk>/feedback/
 *
 * @param {number} eventPk
 * @param {number} receiverParticipantPk
 *
 * @return {string}
 */
export const createFeedbackURL = (eventPk, receiverParticipantPk) => (`${participationEditURL(eventPk, receiverParticipantPk)}feedback/`);

/**
 * current-profile/notifications/
 *
 * @return {string}
 */
export const notificationListURL = () => (`${currentProfileURL()}notifications/`);

/**
 * current-profile/notifications/<notificationPk>
 *
 * @param {number} notificationPk
 *
 * @return {string}
 */
export const notificationEditURL = (notificationPk) => (`${notificationListURL()}${notificationPk}`)


