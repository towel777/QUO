export const GET_PROFILE_ME = 'GET_PROFILE_ME'

const initialState = {
    id: 1,
    fullName: 'Alfred Gitov',
    position: 'Junior back end developer',
    email: 'mail.mailAmail.com',
    pdp: 'PDP',
    status: 'user'
}

const profileReducer = (state = initialState, action) => {

    switch (action.type){
        default:
            return state
    }
}

export const getProfileMe = (session_token) => ({type: GET_PROFILE_ME, session_token})

export default profileReducer
