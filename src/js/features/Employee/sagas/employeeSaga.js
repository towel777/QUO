import {call, put, takeEvery} from 'redux-saga/effects'
import {GET_EMPLOYEE, setEmployee} from "../core/employeeReducer";
import {users} from "../../../common/dal/request";

function * employeeWorker (employeeData) {
    const data = yield call(users.getAllEmployeers, employeeData.session_token)
    yield put(setEmployee(data))
}

export function * employeeWatcher () {
    yield takeEvery(GET_EMPLOYEE, employeeWorker)
}
