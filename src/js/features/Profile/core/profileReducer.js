export const GET_PROFILE_ME = 'GET_PROFILE_ME'
const SET_PROFILE_ME = 'SET_PROFILE_ME'

const initialState = {
    id: null,
    fullName: '',
    position: '',
    email: '',
    pdp: '',
    status: ''
}

const profileReducer = (state = initialState, action) => {

    switch (action.type){
        case SET_PROFILE_ME:{
            return {
                ...state,
                id: action.id,
                fullName: action.fullName,
                position: action.position,
                email: action.email,
                pdp: action.pdp ? action.pdp :'None',
                status: action.status
            }
        }
        default:
            return state
    }
}

export const getProfileMe = (session_token) => ({type: GET_PROFILE_ME, session_token})
export const setProfileMe = (email, fullName, id, pdp, status, position) => ({type: SET_PROFILE_ME, email, fullName, id, pdp, status, position})

export default profileReducer
