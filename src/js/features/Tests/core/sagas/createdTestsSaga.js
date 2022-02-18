import {put, takeEvery} from 'redux-saga/effects'
import {DELETE_CREATED_TEST, GET_CREATED_TESTS, setCreatedTests, setIsFetching} from "../admin/createTestsReducer";
import {deleteTests, postNewCreatedTest, requestCreatedTests} from "../dal/requests";
import {POST_CREATED_TEST} from "../admin/createTestReducer";

const delay = (ms) => new Promise(res => setTimeout(res,ms))

function * createdTestsWorker () {
    yield put(setCreatedTests(requestCreatedTests()))
}

function * deleteTestWorker (data) {
    yield delay(1000)
    yield put(setCreatedTests(deleteTests(data.id)))
    yield put(setIsFetching(false))
}

function * postNewTest (data) {
    yield delay(1000)
    yield postNewCreatedTest(data.test)
}

export function * createdTestsWatcher () {
    yield takeEvery(GET_CREATED_TESTS, createdTestsWorker)
    yield takeEvery(DELETE_CREATED_TEST, deleteTestWorker)
    yield takeEvery(POST_CREATED_TEST, postNewTest)
}
