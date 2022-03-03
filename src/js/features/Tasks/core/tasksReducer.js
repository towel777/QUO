const SET_CURRENT = 'SET_CURRENT'
const DROP_TASK = 'DROP_TASK'
const SET_TASKS = 'SET_TASKS'
export const GET_TASKS = 'GET_TASKS'
const CLEAR_TASKS = 'CLEAR_TASKS'

const initialState = {
    boards: [
        {id: 1, tasksStatus: 'send', tasks: []},
        {id: 2, tasksStatus: 'process', tasks: []},
        {id: 3, tasksStatus: 'finished', tasks: []}
    ],
    currentBoard: [],
    currentTask: []
}

const tasksReducer = (state = initialState, action) => {

    const distribution = (tasks) => {
        return state.boards.map(b => {
            return {...b, tasks: tasks.filter(t => t.status === b.tasksStatus) }
        })
    }

    switch (action.type){
        case SET_CURRENT:{
            return {
                ...state,
                currentBoard: action.board,
                currentTask: action.task
            }
        }
        case DROP_TASK: {
            return {
                ...state,
                boards: action.board
            }

        }
        case SET_TASKS: {
            return {
                ...state,
                boards: distribution(action.tasks)
            }
        }

        default:
            return state
    }

}

export const setCurrent = (board, task) => ({type: SET_CURRENT, board, task})
export const dropTask = (board) => ({type: DROP_TASK, board})
export const setTasks = (tasks) => ({type: SET_TASKS, tasks})
export const getTasks = () => ({type: GET_TASKS})

export default tasksReducer
