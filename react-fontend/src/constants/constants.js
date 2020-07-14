import {home} from "./pagesurls";

export const CLIENT_ID = "283420556311-30r26g3mtt5odkqmit6u7onam3qrul16.apps.googleusercontent.com";
export const CLIENT_SECRET = "KsSTbOaPDbxEbEGqkcyWl3-v";
export const APP_CLIENTID = "4mOLHPfJL0zueHOlawvJXsdnImpjOv3PmLdmm3NT";
export const APP_SECRET = "FW4dYuZsLmE6PQHk7qrPAc4shQhdx2hknqNOh58XO3JQ6PFI8um2z6wyJubxF6hKNOOOJfZUQ67jm5ApN5HJioq4XsNAGSbCLiQZqrqfo6jiy67ddpvMOl3Be8SATFSL";

export const serverURL = "localhost:8000/";

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

