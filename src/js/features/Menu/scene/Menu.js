import {NavLink} from "react-router-dom";
import ui from "../ui.module.css"
import {useState} from "react";
import {AddEmployeeComposer} from "../admin/scene/AddEmployee";
import {connect, useDispatch} from "react-redux";
import {getLogotypeIcon} from "../../../../icons/logotype";
import {compose} from "redux";

const Menu = ({status}) => {

    const dispatch = useDispatch()

    const [addEmployeeModal, setAddEmployeeModal] = useState(false)

    return (
        <div className={ui.box}>
            <div className={ui.menuBox} >
                <div className={ui.logotypeBox}>
                    {getLogotypeIcon(50, 50)}
                    <h1>QUO</h1>
                </div>
                <NavLink className={navData => navData.isActive ? ui.active : ui.link} to="/profile">Profile</NavLink>
                <NavLink className={navData => navData.isActive ? ui.active : ui.link} to="/employee">Employee</NavLink>
                <NavLink className={navData => navData.isActive ? ui.active : ui.link} to="/tasks">Tasks</NavLink>
            </div>
            <div>
                {status && <button onClick={() => setAddEmployeeModal(true)} className={`${ui.btn} ${ui.addEmployeeButton}`}>Add employee</button>}
                <button onClick={() => dispatch({ type: 'LOG_OUT' })} className={ui.btn}>Logout</button>
            </div>
            {addEmployeeModal && <AddEmployeeComposer setAddEmployeeModal={setAddEmployeeModal} />}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        status: state.profile.status
    }
}

export const MenuComposer = compose(connect(mapStateToProps)(Menu))
