const CREATE_NEW_TEST = 'CREATE_NEW_TEST'
const ADD_QUESTION = 'ADD_QUESTION'
const UPDATE_QUESTION = 'UPDATE_QUESTION'
const SET_SELECT_QUESTION = 'SET_SELECT_QUESTION'
const DELETE_QUESTION = 'DELETE_QUESTION'
const SET_ICON_COLOR = 'SET_ICON_COLOR'
const UPDATE_ICON_COLOR = 'UPDATE_ICON_COLOR'
export const POST_CREATED_TEST = 'POST_CREATED_TEST'
const SET_SELECTED_TEST = 'SET_SELECTED_TEST'

const initialState = {
    test: {
        id: null,
        name: null,
        level: 'Junior',
        time: null,
        questions: [
            {
                id: 1,
                number: 1,
                description: '',
                condition: 'waiting',
                answer: ''
            }
        ]
    },
    selectedQuestion: null,
    iconColor: []

}

const createTestReducer = (state = initialState, action) => {

    const generateTestId = (tests) => {
        let idMax = 0
        tests.map(t => {
                t.map(a => {
                    if (a.length !== 0 && idMax >= 0 && idMax < a.id) idMax = a.id
                })
        })
        return ++idMax
    }

    const generateQuestionNumber = (question) => {
        let number = 0
        question.map(q => {
            if (q.length !== 0 && number >= 0 && number < q.number) number = q.number
        })
        return ++number
    }

    const generateQuestionId = (question) => {
        let idMax = 0
        question.map(q => {
            if (q.length !== 0 && idMax >= 0 && idMax < q.id) idMax = q.id
        })
        return ++idMax
    }

    const selectTest = (id) => {
        const searching = state.test.questions.filter(q => q.id === id)
        return searching[0]
    }

    const deletionQuestion = (question) => {
        const deleted =  state.test.questions.filter(q => q.id !== question.id)
        return deleted.map(d => {
            return d.number !== 1 && d.number > question.number ? {...d, number: d.number - 1} : d
        })

    }

    const updateQuestionInformation = (id, description, answer) => {
        return state.test.questions.map(q => {
            return q.id === id ? {...q, description: description, answer: answer} : q
        })
    }


    const updateColor = (id, condition) => {
        return state.iconColor.map(i => {
            return i.id === id ? {...i, condition: condition} : i
        })
    }

    switch (action.type) {
        case CREATE_NEW_TEST:{
            return {
                ...state,
                test: {
                    id: generateTestId(action.tests),
                    name: null,
                    level: 'Junior',
                    time: null,
                    questions: [
                        {
                            id: 1,
                            number: 1,
                            description: '',
                            condition: 'waiting',
                            answer: ''
                        }
                    ]
                }
            }
        }
        case SET_SELECT_QUESTION:{
            return {
                ...state,
                selectedQuestion: selectTest(action.id)
            }
        }
        case ADD_QUESTION:{
            return {
                ...state,
                test: {
                    ...state.test,
                    questions: [
                        ...state.test.questions,
                        {
                            id: generateQuestionId(action.question),
                            number: generateQuestionNumber(action.question),
                            description: '',
                            condition: 'waiting',
                            answer: ''
                        }
                    ]
                },
                iconColor: [
                    ...state.iconColor,
                    {
                        id: generateQuestionId(action.question),
                        condition: 'waiting'
                    }
                ]

            }
        }
        case DELETE_QUESTION:{
            return  {
                ...state,
                test: {
                    ...state.test,
                    questions: deletionQuestion(action.question)
                },
                iconColor: state.iconColor.filter(q => q.id !== action.question.id)
            }
        }
        case SET_ICON_COLOR:{
            return {
                ...state,
                iconColor: action.question.map(q => {
                    return {id: q.id, condition: q.condition}
                })

            }
        }
        case UPDATE_ICON_COLOR:{
            return {
                ...state,
                iconColor: updateColor(action.id, action.condition)
            }
        }
        case UPDATE_QUESTION:{
            return {
                ...state,
                test: {
                    ...state.test,
                    questions: updateQuestionInformation(action.id, action.description, action.answer)
                }
            }
        }
        case SET_SELECTED_TEST: {
            return {
                ...state,
                test: action.test[0]
            }
        }
        default:
            return state
    }
}

export const createNewTest = (tests) => ({type: CREATE_NEW_TEST, tests})
export const setSelectQuestion = (id) => ({type: SET_SELECT_QUESTION, id})
export const addQuestion = (question) => ({type: ADD_QUESTION, question})
export const deleteQuestion = (question) => ({type: DELETE_QUESTION, question})
export const setIconColor = (question) => ({type: SET_ICON_COLOR, question})
export const updateIconColor = (id, condition) => ({type: UPDATE_ICON_COLOR, id, condition})
export const updateQuestion = (id, description, answer) => ({type: UPDATE_QUESTION, id, description, answer})
export const postCreatedTest = (test) => ({type: POST_CREATED_TEST, test})
export const setCreatedTest = (test) => ({type: SET_SELECTED_TEST, test})

export default createTestReducer
