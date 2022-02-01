import profileReducer from "../features/Profile/core/profileReducer";
import {combineReducers, createStore} from "redux";
import employeeReducer from "../features/Employee/core/employeeReducer";
import tasksReducer from "../features/Tasks/core/tasksReducer";

const reducers = combineReducers({
    profile: profileReducer,
    employee: employeeReducer,
    tasks: tasksReducer
})

const store = createStore(reducers)


export default store
