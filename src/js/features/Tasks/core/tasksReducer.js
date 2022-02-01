const SET_CURRENT_BOARD = 'SET_CURRENT_BOARD'
const SET_CURRENT_TASK = 'SET_CURRENT_TASK'

const initialState = {
    boards: [
        {id: 1, tasks: [
                {id: 1, title: 'Do', description: 'Create form', status: 'send'},
                {id: 2, title: 'Do', description: 'Create form', status: 'send'},
                {id: 3, title: 'Do', description: 'Create form', status: 'send'},
                {id: 4, title: 'Do', description: 'Create form', status: 'send'},
                {id: 5, title: 'Do', description: 'Create form', status: 'send'},
                {id: 6, title: 'Do', description: 'Create form', status: 'send'},
                {id: 7, title: 'Do', description: 'Create form', status: 'send'}
            ]},
        {id: 2, tasks: []},
        {id: 3, tasks: []}
    ],
    currentBoard: [],
    currentTask: []
}

const tasksReducer = (state = initialState, action) => {
    switch (action.type){
        case SET_CURRENT_BOARD:{
            return {
                ...state,
                currentBoard: action.board
            }
        }

        case SET_CURRENT_TASK:{
            return {...state}
        }

        default:
            return state
    }

}



export default tasksReducer
