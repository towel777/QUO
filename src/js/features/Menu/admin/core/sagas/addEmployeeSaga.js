import {call, takeEvery} from 'redux-saga/effects'
import {users} from "../../../../../common/dal/request";
import {GET_ALL_POSITIONS, POST_NEW_EMPLOYEE} from "../../../../Employee/core/employeeReducer";

function * addEmployeeWorker (data) {
    yield call(users.postNewEmployee,
        data.newEmployeeData.session_token,
        data.newEmployeeData.email,
        data.newEmployeeData.full_name,
        data.newEmployeeData.admin_status,
        data.newEmployeeData.position)
}
function * setAllPositionsWorker (positionsData) {
    const data = yield call(users.postPosition, positionsData.session_token)
}

export function * addEmployeeWatcher () {
    yield takeEvery(POST_NEW_EMPLOYEE, addEmployeeWorker)
    yield takeEvery(GET_ALL_POSITIONS, setAllPositionsWorker)
}
