const SET_AUTHENTICATION_STATUS = 'SET_AUTHENTICATION_STATUS'
export const POST_LOGIN_AUTHENTICATION = 'POST_LOGIN_AUTHENTICATION'
const LOG_OUT = 'LOG_OUT'
const SET_LOCAL_STORAGE_INFO = 'SET_LOCAL_STORAGE_INFO'
export const CREATE_NEW_COMPANY = 'CREATE_NEW_COMPANY'

const initialState = {
    authenticationStatus: false,
    session_token: null
}

const authentificationReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_AUTHENTICATION_STATUS:{
            return {
                ...state,
                authenticationStatus: true,
                session_token: action.session_token
            }
        }
        case LOG_OUT:{
            return {
                ...state,
                authenticationStatus: false,
                session_token: null
            }
        }
        case SET_LOCAL_STORAGE_INFO:{
            return {
                ...state,
                authenticationStatus: action,
                session_token: action
            }
        }
        default:
            return state
    }
}

export const postLoginAuthentication = (email, psw) => ({type: POST_LOGIN_AUTHENTICATION, email, psw})
export const setAuthenticationStatus = (session_token) => ({type: SET_AUTHENTICATION_STATUS, session_token})
export const setLocalStorageInfo = (info) => ({type: SET_LOCAL_STORAGE_INFO, info})
export const createNewCompany = (info) => ({type: CREATE_NEW_COMPANY, info})

export default authentificationReducer
