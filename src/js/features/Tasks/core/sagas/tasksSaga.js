import {put, takeEvery} from 'redux-saga/effects'
import {GET_TASKS, setTasks} from "../tasksReducer";
import {requestTasks} from "../dal/request";

function * testsWorker () {
    yield put(setTasks(requestTasks()))
}

export function * tasksWatcher () {
    yield takeEvery(GET_TASKS, testsWorker)
}
