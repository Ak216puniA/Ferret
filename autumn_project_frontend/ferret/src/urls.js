// Backend URls

export const OAUTH_AUTH_ROOT = 'https://channeli.in/oauth/authorise/'
export const CLIENT_ID = 'AIEwG4pJKHWdgNWHeaUs56KpDNfHyEgBQLKRz1DL'
export const REDIRECT_URI = 'http://localhost:8000/auth/login/'
export const STATE = 'foo_success216'
export const OAUTH_AUTH = `${OAUTH_AUTH_ROOT}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`

export const BACKEND_BASE_URL = 'http://localhost:8000/'
export const IS_USER_AUTHENTICATED = `${BACKEND_BASE_URL}api/is_user_authenticated/`
export const USERS = `${BACKEND_BASE_URL}user/`
export const SEASONS_BY_TYPE = `${BACKEND_BASE_URL}recruitment_season/`
export const ROUNDS = `${BACKEND_BASE_URL}round/`
export const SECTIONS = `${BACKEND_BASE_URL}section/`
export const QUESTIONS = `${BACKEND_BASE_URL}question/`
export const CANDIDATES = `${BACKEND_BASE_URL}candidate/`
export const CANDIDATE_ROUND = `${BACKEND_BASE_URL}candidate_round/`
export const CANDIDATE_MARKS = `${BACKEND_BASE_URL}candidate_marks/`
export const SECTION_MARKS = `${BACKEND_BASE_URL}api/section_marks/`
export const CANDIDATE_SECTION_MARKS = `${BACKEND_BASE_URL}api/candidate_section_marks/`
export const LOGOUT = `${BACKEND_BASE_URL}auth/logout/`
export const CSV = `${BACKEND_BASE_URL}api/csv/`
export const FILTER_CANDIDATES = `${BACKEND_BASE_URL}api/filter_candidates/`
export const INTERVIEW_PANEL = `${BACKEND_BASE_URL}interview_panel/`


// Frontend URLs

export const FRONTEND_BASE_URL = 'http://localhost:3000/'
export const HOME = `/home`
export const SEASON_DASHBOARD = `/season`