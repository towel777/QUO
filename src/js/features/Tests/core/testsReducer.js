
const SET_TESTS = 'SET_TESTS'
export const GET_TESTS = 'GET_TESTS'

const initialState = {
    junior: [],
    middle: [],
    senior: []
}

const testsReducer = (state = initialState, action) => {
    const distribution = (tests, level) => {
        return tests.filter(f => {
            return f.level === level
        })
    }

    switch (action.type) {
        case SET_TESTS:{
            return {
                ...state,
                junior: distribution(action.tests, 'Junior'),
                middle: distribution(action.tests, 'Middle'),
                senior: distribution(action.tests, 'Senior')
            }
        }
        default:
            return state
    }
}

export const setTests = (tests) => ({type: SET_TESTS, tests})
export const getTests = () => ({type: GET_TESTS})


export default testsReducer
