import {serverURL} from "./constants";

let apiBaseUrl = serverURL + 'api/v0.1/';

export const eventListURL = (joinable = true, joined = true, owned = false) => (apiBaseUrl + `events/?joined=${joined}&joinable=${joinable}&owned=${owned}`);

export const eventCreateURL = () => (apiBaseUrl + 'events/');

export const eventDetailURL = (eventPk) => (`${eventCreateURL()}${eventPk}/`);

export const eventJoinURL = (eventPk) => (`${eventDetailURL(eventPk)}participants/`);

export const nominatimCoordinatesToAddressURL = (latitude, longitude) => (`https://nominatim.openstreetmap.org/reverse/?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);

export const eventRunURL = (eventPk) => (`${eventDetailURL(eventPk)}run/`);

export const participationEditURL = (eventPk, participantPk) => (`${eventJoinURL(eventPk)}${participantPk}/`);

export const currentProfileURL = () => (apiBaseUrl + 'current-profile/');

export const convertTokenURL = () => (apiBaseUrl + 'auth/convert-token');

export const tokenURL = () => (apiBaseUrl + 'auth/token');

export const signupURL = () => (apiBaseUrl + 'signup/');

export const profilesURL = (profilePk) => (apiBaseUrl + `profiles/${profilePk}/`);

export const carsListURL = (profilePk) => (`${profilesURL(profilePk)}cars/`);

export const carsDetailURL = (profilePk, carPk) => (`${carsListURL(profilePk)}${carPk}/`);

export const createFeedbackURL = (eventPk, receiverParticipantPk) => (`${participationEditURL(eventPk, receiverParticipantPk)}feedback/`);

export const editFeedbackURL = (eventPk, receiverParticipantPk, feedbackPk) => (`${createFeedbackURL(eventPk, receiverParticipantPk)}${feedbackPk}/`);

export const notificationListURL = () => (`${currentProfileURL()}notifications/`);
export const notificationEditURL = (notificationPk) => (`${notificationListURL()}${notificationPk}`)


