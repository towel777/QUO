const SET_TEST = 'SET_TEST'
const UPDATE_QUESTION_CONDITION = 'UPDATE_QUESTION_CONDITION'
const STARTED_QUESTION = 'STARTED_QUESTION'
const UPDATE_QUESTION_ANSWER = 'UPDATE_QUESTION_ANSWER'

const initialState = {
    id: null,
    name: '',
    level: '',
    time: null,
    questions: [],
    finishedQuestion: []
}

const testReducer = (state = initialState, action) => {

    const updateCondition = (id, condition) => {
        return state.questions.map(t => {
            return t.id === id ? {...t, condition: condition} : t
        })
    }

    const updateAnswer = (id, answer) => {
        return state.finishedQuestion.map(a => {
            return a.id === id ? {...a, answer: answer} : a
        })
    }

    const searchTestCopy = (test) => {

        if (!state.finishedQuestion.length) return true

        return !state.finishedQuestion.some(f => f.id === test.id);
    }

    switch (action.type) {
        case SET_TEST:{
            return {
                ...state,
                id: action.id,
                name: action.name,
                level: action.level,
                time: action.time,
                questions: action.questions

            }
        }
        case UPDATE_QUESTION_CONDITION:{
            return {
                ...state,
                questions: updateCondition(action.id, action.condition)
            }
        }
        case STARTED_QUESTION:{
            return {
                ...state,
                finishedQuestion: searchTestCopy(action.question) ? [...state.finishedQuestion, action.question] : [...state.finishedQuestion]
            }
        }
        case UPDATE_QUESTION_ANSWER:{
            return {
                ...state,
                finishedQuestion: updateAnswer(action.id, action.answer)
            }
        }
        default:
            return state
    }
}
export const setTest = (id, name, level, time, questions) => ({type: SET_TEST, id, name, level, time, questions})
export const updateQuestionCondition = (id, condition) => ({type: UPDATE_QUESTION_CONDITION, id, condition})
export const updateQuestionAnswer = (id, answer) => ({type: UPDATE_QUESTION_ANSWER, id, answer})
export const startedQuestion = (question) => ({type: STARTED_QUESTION, question})

export default testReducer
