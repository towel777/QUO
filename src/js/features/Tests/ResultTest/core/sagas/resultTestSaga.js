import {put, takeEvery} from 'redux-saga/effects'
import {GET_RESULT_TESTS, setResultTests} from "../resultTestReducer";
import {getResultTestsData} from "../../../../../common/dal/request";

function * resultTestsWorker () {
    yield put(setResultTests(getResultTestsData()))
}

export function * resultTestsWatcher () {
    yield takeEvery(GET_RESULT_TESTS, resultTestsWorker)
}
