import Menu from "./features/Menu/scene/Menu";
import {Route, Routes} from "react-router-dom";
import {ProfileComposer} from "./features/Profile/scene/Profile";
import {EmployeeComposer} from "./features/Employee/scene/Employee";
import {TasksComposer} from "./features/Tasks/scene/Tasks";
import ui from "./ui.module.css"

const Home = () => {
    return (
        <div className={ui.box} >
            <div className={ui.menuBox}>
                <Menu />
            </div>
            <div className={ui.routeBox}>
                <Routes>
                    <Route path="/profile" element={<ProfileComposer />} />
                    <Route path="/employee/:empoyeerId" element={<EmployeeComposer/>} />
                    <Route path="/employee/" element={<EmployeeComposer/>} />
                    <Route path="/tasks" element={<TasksComposer/>} />
                </Routes>
            </div>
        </div>
    )
}

export default Home
