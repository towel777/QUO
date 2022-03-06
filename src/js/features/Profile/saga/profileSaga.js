import {put, takeEvery, call} from 'redux-saga/effects'
import {GET_PROFILE_ME, setProfileMe} from "../core/profileReducer";
import {authentication} from "../../../common/dal/request";

function * profileWorker (profileData) {
    const data = yield call(authentication.getProfile, profileData.session_token)
    yield put(setProfileMe(data.email, data.full_name, data.user_id, data.pdp, data.admin_status, data.position))
}

export function * profileWatcher () {
    yield takeEvery(GET_PROFILE_ME, profileWorker)
}
