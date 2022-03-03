import profileReducer from "../features/Profile/core/profileReducer";
import {applyMiddleware, combineReducers, createStore} from "redux";
import employeeReducer from "../features/Employee/core/employeeReducer";
import tasksReducer from "../features/Tasks/core/tasksReducer";
import testReducer from "../features/Tests/core/testReducer";
import testsReducer from "../features/Tests/core/testsReducer";
import createSagaMiddleware from 'redux-saga'
import createTestReducer from "../features/Tests/core/admin/createTestReducer";
import createTestsReducer from "../features/Tests/core/admin/createTestsReducer";
import {rootWatcher} from "../common/commonSagas";
import resultTestReducer from "../features/Tests/ResultTest/core/resultTestReducer";
import authentificationReducer from "../features/authentification/core/authentificationReducer";

const sagaMiddleware = createSagaMiddleware()


const reducers = combineReducers({
    profile: profileReducer,
    employee: employeeReducer,
    tasks: tasksReducer,
    tests: testsReducer,
    test: testReducer,
    createTest: createTestReducer,
    createTests: createTestsReducer,
    resultTest: resultTestReducer,
    authentification: authentificationReducer
})


const store = createStore(reducers, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootWatcher)


export default store
