/**
 * Application landing page url
 * @type {string}
 */
export const landingPage = "/";

/**
 * Application home page url
 * @type {string}
 */
export const home = "/home";

/**
 * Application home page url with query filters
 *
 * @param {boolean} joinable joinable filter
 * @param {boolean} joined joined filter
 * @param {boolean} owned owned filter
 *
 * @return {string} url
 */
export const homeJoinableJoinedOwned = (joinable, joined, owned) => (`${home}?joinable=${joinable}&joined=${joined}&owned=${owned}`)

/**
 * Application login page url
 * @type {string}
 */
export const login = "/login";

/**
 * Application signup page url
 * @type {string}
 */
export const signup = "/signup";

/**
 * Application add event page url
 * @type {string}
 */
export const addEvent = "/add"

/**
 * Application user profile page url
 * @type {string}
 */
export const myProfile = "/my-profile";

/**
 * Application non-user profile page url (:id)
 * @type {string}
 */
export const profile_id = "/profiles/:id";

/**
 * Application non-user profile page url
 *
 * @param {number} id
 *
 * @return {string} url
 */
export const profile = (id) => `/profiles/${id}`;

/**
 * Application event page url (:id)
 * @type {string}
 */
export const event_id = "/events/:id";

/**
 * Application event page url
 *
 * @param {number} id
 *
 * @return {string} url
 */
export const eventPage = (id) => `/events/${id}`;
