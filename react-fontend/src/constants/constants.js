import {home} from "./pagesurls";

export const CLIENT_ID = "283420556311-30r26g3mtt5odkqmit6u7onam3qrul16.apps.googleusercontent.com";
export const CLIENT_SECRET = "KsSTbOaPDbxEbEGqkcyWl3-v";
export const APP_CLIENTID = "8IZXSeck6jSIkFusuYgwtHRsTu54jNGkXVNdbYkf";
export const APP_SECRET = "s0JmNch2RAlCE88gcnHk2S8uQdXmrVXxJxHHWTIQCuSRSV6NGahJldAy8bfvby47WEBRbnb9xKUORPXZAjKMNRlqbsCSkIhFYsC8UzzfExyMfxD0BMpkR1lpnAfj8EdQ";

export const serverURL = "/";

export const status = [
    'Joinable',
    'Computing',
    'Computed'
];


export const landingpageback = serverURL + "media/landingpageback.jpg"

export const landingpageProfile = (num) => (serverURL + `media/profile_pictures/mock${num}.jpg`)
export const landingpageEvent = (num) => (serverURL + `media/event_pictures/mock${num}.jpg`)

export const defaultProfilePic = serverURL + "media/default-profile.jpg"
export const defaultEventPic = serverURL + "media/default-event.jpg"