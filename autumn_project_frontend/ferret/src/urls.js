export const OAUTH_AUTH_ROOT = 'https://channeli.in/oauth/authorise/'
export const CLIENT_ID = 'AIEwG4pJKHWdgNWHeaUs56KpDNfHyEgBQLKRz1DL'
export const REDIRECT_URL = 'http://localhost:8000/auth/login/'
export const DESIRED_STATE = 'foo'
export const OAUTH_AUTH = `${OAUTH_AUTH_ROOT}/?response_type=code&client_id=${CLIENT_ID}&redirect_url=${REDIRECT_URL}&state=${DESIRED_STATE}`