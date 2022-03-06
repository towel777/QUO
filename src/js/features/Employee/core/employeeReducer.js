const SET_EMPLOYEE = 'SET_EMPLOYEE'
export const GET_EMPLOYEE = 'GET_EMPLOYEE'
export const POST_NEW_EMPLOYEE = 'POST_NEW_EMPLOYEE'
export const GET_ALL_POSITIONS = 'GET_ALL_POSITIONS'

const initialState = {
    employee: []
}

const employeeReducer = (state = initialState, action) => {

    const distributionEmployeers = (employeers) => {
        debugger
        return employeers.map(e => {
            return {
                id: e.user_id,
                fullName: e.full_name,
                position: e.position.position,
                email: e.email,
                pdp: e.pdp ? e.pdp : 'None',
                status: e.admin_status
            }
        })
    }

    switch (action.type){
        case SET_EMPLOYEE: {
            return {
                ...state,
                employee: distributionEmployeers(action.employeers)
            }
        }
        default:
            return state
    }
}

export const setEmployee = (employeers) => ({type: SET_EMPLOYEE, employeers})
export const getEmployee = (session_token) => ({type: GET_EMPLOYEE, session_token})
export const postNewEmployee = (newEmployeeData) => ({type: POST_NEW_EMPLOYEE, newEmployeeData})
export const getAllPositions = (session_token) => ({type: GET_ALL_POSITIONS, session_token})

export default employeeReducer
