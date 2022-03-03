import {put, takeEvery, call} from 'redux-saga/effects'
import {CREATE_NEW_COMPANY, POST_LOGIN_AUTHENTICATION, setAuthenticationStatus} from "../authentificationReducer";
import {authentication} from "../../../../common/dal/request";

function * loginWorker (loginData) {
    const data = yield call(authentication.postLogin, loginData.email, loginData.psw)
    yield put(setAuthenticationStatus(data.session_token))
}

function * createCompanyWorker (createCompanyData) {
    const data = yield call(authentication.postNewCompany, createCompanyData.info.name, createCompanyData.info.employee, createCompanyData.info.positions)
}

export function * authenticationWatcher () {
    yield takeEvery(POST_LOGIN_AUTHENTICATION, loginWorker)
    yield takeEvery(CREATE_NEW_COMPANY, createCompanyWorker)
}
