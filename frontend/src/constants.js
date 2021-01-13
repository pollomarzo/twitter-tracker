export const BASE_URL = 'http://localhost:4000';

// API ENDPOINTS
export const GEO_FILTER = `${BASE_URL}/api/geoFilter`;
export const GET_IDS = `${BASE_URL}/api/getUserIDs`;
export const REQUEST_TOKEN = `${BASE_URL}/api/requestToken`;
export const AUTH = `${BASE_URL}/api/auth`;
export const SEND_TWEET = `${BASE_URL}/api/sendTweet`;
export const NOTIFICATION = `${BASE_URL}/api/notification`;
export const SETTINGS = `${BASE_URL}/api/settings`;

export const MAP_ID = 'map';
export const WORDCLOUD_ID = 'wordcloud';

export const FABsDesc = {
  params: `Here you can select a specific user and/or a specific hashtag to retrieve your tweeets.
    You could also select a specific area on the map to get all the tweet geoocalized in that area`,

  filter: `Here you can select specific filter to be applied to the list currently on the client`,

  schedule: `By authenticating here you can set an interval upon wich a tweet will be published on your
    account with the given text and an image of the map and/or the picture of the wordcloud`,

  email: `Here you can set a reminder for when a certain treshold (in number of tweet captured) is surpassed
    once the treshold is reached an email to the given address will be sent, remember to check the spam folder`,
};
