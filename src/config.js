export const port = process.env.PORT || 8085;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const googleAnalyticsId = 'UA-61502306-1';
export const googleApiKey = process.env.GOOGLE_API_KEY || 'AIzaSyDn9YGVNo4kN7qqDD8t1qf613K6S0TTxuA';
export const hostAddress = process.env.WEBSITE_ADDRESS || `http://${host}`;
export const iapiBase = process.env.NODE_ENV === 'development' ? 'http://iapi.curtmfg.com' : 'https://iapi.curtmfg.com';
export const apiBase = process.env.NODE_ENV === 'development' ? 'http://goapi.curtmfg.com' : 'https://goapi.curtmfg.com';
export const apiKey = process.env.API_KEY !== undefined && process.env.API_KEY !== 'undefined' ? process.env.API_KEY : '9300f7bc-2ca6-11e4-8758-42010af0fd79';
export const brand = '3';
