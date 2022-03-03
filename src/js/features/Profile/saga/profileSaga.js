import {put, takeEvery, call} from 'redux-saga/effects'
import {GET_PROFILE_ME} from "../core/profileReducer";
import {authentication} from "../../../common/dal/request";

function * profileWorker (profileData) {
    const data = yield call(authentication.getProfile, profileData.session_token)
}

export function * profileWatcher () {
    yield takeEvery(GET_PROFILE_ME, profileWorker)
}
