export const landingPage = "/";
export const home = "/home";
export const homeJoinableJoinedOwned = (joinable, joined, owned) => (`${home}?joinable=${joinable}&joined=${joined}&owned=${owned}`)
export const login = "/login";
export const signup = "/signup";
export const addEvent = "/add"
export const myProfile = "/my-profile";
export const profile_id = "/profiles/:id";
export const profile = (id) => `/profiles/${id}`;
export const event_id = "/events/:id";
export const eventPage = (id) => `/events/${id}`;
