import {all} from 'redux-saga/effects'
import {testsWatcher} from "../features/Tests/core/sagas/testsSaga";
import {createdTestsWatcher} from "../features/Tests/core/sagas/createdTestsSaga";
import {tasksWatcher} from "../features/Tasks/core/sagas/tasksSaga";
import {employeeWatcher} from "../features/Employee/sagas/employeeSaga";
import {addEmployeeWatcher} from "../features/Menu/admin/core/sagas/addEmployeeSaga";
import {resultTestsWatcher} from "../features/Tests/ResultTest/core/sagas/resultTestSaga";
import {authenticationWatcher} from "../features/authentification/core/sagas/authentificationSaga";
import {profileWatcher} from "../features/Profile/saga/profileSaga";

export function * rootWatcher () {
    yield all([
        testsWatcher(),
        createdTestsWatcher(),
        tasksWatcher(),
        employeeWatcher(),
        addEmployeeWatcher(),
        resultTestsWatcher(),
        authenticationWatcher(),
        profileWatcher()])
}
