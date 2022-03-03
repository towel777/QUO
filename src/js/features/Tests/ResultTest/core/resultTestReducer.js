export const GET_RESULT_TESTS = 'GET_RESULT_TESTS'
const SET_RESULT_TESTS = 'SET_RESULT_TESTS'

const initialState = {
    resultTests: [],
    testStatus: null
}

const resultTestReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_RESULT_TESTS:{
            return {
                ...state,
                resultTests: action.tests
            }
        }
        default:
            return state
    }
}

export const getResultTests = () => ({type: GET_RESULT_TESTS})
export const setResultTests = (tests) => ({type: SET_RESULT_TESTS, tests})

export default resultTestReducer
