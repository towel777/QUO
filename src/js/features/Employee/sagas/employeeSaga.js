import {put, takeEvery} from 'redux-saga/effects'
import {GET_EMPLOYEE, setEmployee} from "../core/employeeReducer";
import {requestEmployee} from "../dal/request";

function * employeeWorker () {
    yield put(setEmployee(requestEmployee()))
}

export function * employeeWatcher () {
    yield takeEvery(GET_EMPLOYEE, employeeWorker)
}
