import {put, takeEvery} from 'redux-saga/effects'
import {GET_TESTS, setTests} from "../testsReducer";
import {requestTests} from "../dal/requests";

function * testsWorker () {
    yield put(setTests(requestTests()))
}

export function * testsWatcher () {
    yield takeEvery(GET_TESTS, testsWorker)
}
