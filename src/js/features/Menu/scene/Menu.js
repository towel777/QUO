import {NavLink} from "react-router-dom";
import ui from "../ui.module.css"

const Menu = () => {
    return (
        <div className={ui.box}>
            <div className={ui.menuBox} >
                <img className={ui.logotype} src="https://upload.wikimedia.org/wikipedia/commons/a/a4/FAUA_logotype.png" alt=""/>
                <NavLink className={navData => navData.isActive ? ui.active : ui.link} to="/profile">Profile</NavLink>
                <NavLink className={navData => navData.isActive ? ui.active : ui.link} to="/employee">Employee</NavLink>
                <NavLink className={navData => navData.isActive ? ui.active : ui.link} to="/tasks">Tasks</NavLink>
            </div>
            <button className={ui.btn}>
                Logout
            </button>
        </div>
    )
}

export default Menu
