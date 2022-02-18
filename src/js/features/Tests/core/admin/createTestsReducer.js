const SET_CREATED_TESTS = 'SET_CREATED_TESTS'
export const GET_CREATED_TESTS = 'GET_CREATED_TESTS'
export const DELETE_CREATED_TEST = 'DELETE_CREATED_TEST'
const SET_IS_FETCHING = 'SET_IS_FETCHING'

const initialState = {
    junior: [],
    middle: [],
    senior: [],
    isFetching: false
}

const createTestsReducer = (state = initialState, action) => {

    const distribution = (tests, level) => {
        return tests.filter(f => f.level === level)
    }

    switch (action.type) {
        case SET_CREATED_TESTS:{
            return {
                ...state,
                junior: distribution(action.tests, 'Junior'),
                middle: distribution(action.tests, 'Middle'),
                senior: distribution(action.tests, 'Senior')
            }
        }
        case SET_IS_FETCHING: {
            return {
                ...state,
                isFetching: action.isFetch
            }
        }
        default:
            return state
    }
}

export const setCreatedTests = (tests) => ({type: SET_CREATED_TESTS, tests})
export const getCreatedTests = () => ({type: GET_CREATED_TESTS})
export const deleteCreatedTest = (id) => ({type: DELETE_CREATED_TEST, id})
export const setIsFetching = (isFetch) => ({type: SET_IS_FETCHING, isFetch})


export default createTestsReducer
