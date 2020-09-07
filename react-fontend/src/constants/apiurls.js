import {serverURL} from "./constants";

/**
 * Base api url i.e. `serverURL + api/v0.1/`
 *
 * See {@link serverURL}
 *
 * @type {string}
 */
let apiBaseUrl = serverURL + 'api/v0.1/';

/**
 * All the events list url with the boolean filters
 *
 * @param {boolean} joinable joinable filter
 * @param {boolean} joined joined filter
 * @param {boolean} owned owned filter
 *
 * @return {string} url
 */
export const eventListURL = (joinable = true, joined = true, owned = false) => (apiBaseUrl + `events/?joined=${joined}&joinable=${joinable}&owned=${owned}`);

/**
 * URL to create an event
 *
 * @return {string} url
 */
export const eventCreateURL = () => (apiBaseUrl + 'events/');

/**
 * URL for an event
 *
 * @param {number} eventPk event id
 *
 * @return {string} url
 */
export const eventDetailURL = (eventPk) => (`${eventCreateURL()}${eventPk}/`);

/**
 * URL to join an event
 *
 * @param {number} eventPk event id
 *
 * @return {string} url
 */
export const eventJoinURL = (eventPk) => (`${eventDetailURL(eventPk)}participants/`);

/**
 * URL to start event computation
 *
 * @param {number} eventPk event id
 *
 * @return {string} url
 */
export const eventRunURL = (eventPk) => (`${eventDetailURL(eventPk)}run/`);

/**
 * URL to edit a participation
 *
 * @param {number} eventPk event id
 * @param {number} participantPk participant id
 *
 * @return {string} url
 */
export const participationEditURL = (eventPk, participantPk) => (`${eventJoinURL(eventPk)}${participantPk}/`);

/**
 * URL for the user profile
 *
 * @return {string} url
 */
export const currentProfileURL = () => (apiBaseUrl + 'current-profile/');

/**
 * URL to convert the google token to an application token
 *
 * @return {string} url
 */
export const convertTokenURL = () => (apiBaseUrl + 'auth/convert-token');

/**
 * URL from which obtain the application token with usr:psw
 *
 * @return {string} url
 */
export const tokenURL = () => (apiBaseUrl + 'auth/token');

/**
 * URL for the signup process
 *
 * @return {string} url
 */
export const signupURL = () => (apiBaseUrl + 'signup/');

/**
 * URL for the non-user profiles
 *
 * @param {number} profilePk profile id
 *
 * @return {string} url
 */
export const profilesURL = (profilePk) => (apiBaseUrl + `profiles/${profilePk}/`);

/**
 * URL for the user car list
 *
 * @param {number} profilePk profile id
 *
 * @return {string} url
 */
export const carsListURL = (profilePk) => (`${profilesURL(profilePk)}cars/`);

/**
 * URL for the a user car
 *
 * @param {number} profilePk profile id
 * @param {number} carPk car id
 *
 * @return {string} url
 */
export const carsDetailURL = (profilePk, carPk) => (`${carsListURL(profilePk)}${carPk}/`);

/**
 * URL to create a feedback
 *
 * @param {number} eventPk event id
 * @param {number} receiverParticipantPk receiver participation id
 *
 * @return {string} url
 */
export const createFeedbackURL = (eventPk, receiverParticipantPk) => (`${participationEditURL(eventPk, receiverParticipantPk)}feedback/`);

/**
 * URL to amend a feedback
 *
 * @param {number} eventPk event id
 * @param {number} receiverParticipantPk receiver participation id
 * @param {number} feedbackPk feedback id
 *
 * @return {string} url
 */
export const editFeedbackURL = (eventPk, receiverParticipantPk, feedbackPk) => (`${createFeedbackURL(eventPk, receiverParticipantPk)}${feedbackPk}/`);

/**
 * URL to retrieve notifications
 *
 * @return {string} url
 */
export const notificationListURL = () => (`${currentProfileURL()}notifications/`);

/**
 * URL to read a notification
 *
 * @param {number} notificationPk notification id
 *
 * @return {string} url
 */
export const notificationEditURL = (notificationPk) => (`${notificationListURL()}${notificationPk}`)

/**
 * Nominatim API URL for the reverse lookup (from coordinate pair to address)
 *
 * @param {number} latitude
 * @param {number} longitude
 *
 * @return {string} url
 */
export const nominatimCoordinatesToAddressURL = (latitude, longitude) => (`https://nominatim.openstreetmap.org/reverse/?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);

/**
 * Nominatim API to search for an address
 *
 * @param {string} addr address
 *
 * @return {string} url
 */
export const nominatimSearchAddressURL = (addr) => (
    `https://nominatim.openstreetmap.org/search/?q=${encodeURI(addr)}&format=json&limit=3&addressdetails=1&dedupe=1`
)

