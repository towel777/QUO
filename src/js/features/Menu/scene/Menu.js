import {NavLink} from "react-router-dom";
import ui from "../ui.module.css"
import {useState} from "react";
import {AddEmployeeComposer} from "../admin/scene/AddEmployee";
import {useDispatch} from "react-redux";

const Menu = () => {

    const dispatch = useDispatch()

    const [addEmployeeModal, setAddEmployeeModal] = useState(false)

    return (
        <div className={ui.box}>
            <div className={ui.menuBox} >
                <img className={ui.logotype} src="https://upload.wikimedia.org/wikipedia/commons/a/a4/FAUA_logotype.png" alt=""/>
                <NavLink className={navData => navData.isActive ? ui.active : ui.link} to="/profile">Profile</NavLink>
                <NavLink className={navData => navData.isActive ? ui.active : ui.link} to="/employee">Employee</NavLink>
                <NavLink className={navData => navData.isActive ? ui.active : ui.link} to="/tasks">Tasks</NavLink>
            </div>
            <div>
                <button onClick={() => setAddEmployeeModal(true)} className={`${ui.btn} ${ui.addEmployeeButton}`}>Add employee</button>
                <button onClick={() => dispatch({ type: 'LOG_OUT' })} className={ui.btn}>Logout</button>
            </div>
            {addEmployeeModal && <AddEmployeeComposer setAddEmployeeModal={setAddEmployeeModal} />}
        </div>
    )
}

export default Menu
