const SET_EMPLOYEE = 'SET_EMPLOYEE'
export const GET_EMPLOYEE = 'GET_EMPLOYEE'
export const POST_NEW_EMPLOYEE = 'POST_NEW_EMPLOYEE'
export const GET_ALL_POSITIONS = 'GET_ALL_POSITIONS'

const initialState = {
    employee: []
}

const employeeReducer = (state = initialState, action) => {

    switch (action.type){
        case SET_EMPLOYEE: {
            return {
                ...state,
                employee: action.employee
            }
        }
        default:
            return state
    }
}

export const setEmployee = (employee) => ({type: SET_EMPLOYEE, employee})
export const getEmployee = () => ({type: GET_EMPLOYEE})
export const postNewEmployee = (newEmployeeData) => ({type: POST_NEW_EMPLOYEE, newEmployeeData})
export const getAllPositions = (session_token) => ({type: GET_ALL_POSITIONS, session_token})

export default employeeReducer
