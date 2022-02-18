import {all} from 'redux-saga/effects'
import {testsWatcher} from "../features/Tests/core/sagas/testsSaga";
import {createdTestsWatcher} from "../features/Tests/core/sagas/createdTestsSaga";

export function * rootWatcher () {
    yield all([testsWatcher(), createdTestsWatcher()])
}
