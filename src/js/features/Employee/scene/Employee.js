import ui from "../ui.module.css"
import {compose} from "redux";
import {connect} from "react-redux";
import {NavLink, useParams} from "react-router-dom";

export const Employee = ({id, fullName, position, email, pdp}) => {
    const {empoyeerId} = useParams()

    if (empoyeerId == id) {
        return (
            <div className={ui.box} >
                <div className={`${ui.info} ${ui.name}`}>{fullName}</div>
                <div className={ui.infoList}>
                    <div className={ui.info}>{position}r</div>
                    <div className={ui.info}>{email}</div>
                    <div className={ui.info}>{pdp}</div>
                </div>
                <button className={ui.btn}>Employee tasks</button>
            </div>
        )
    } else return null
}

export const EmployeeList = ({employees}) => {
    return (
        <div className={ui.flexContainer}>
            <ul className={ui.listContainer}>
                {employees.map(e => {
                    return (
                        <li key={e.id} className={ui.listElement}>
                            <NavLink className={navData => navData.isActive ? ui.listElementLinkActive : ui.listElementLink} to={`/employee/${e.id}`}>{e.fullName}</NavLink>
                        </li>
                    )/*Max 12 unit*/
                })}
            </ul>
            <div className={ui.paginationBox}>
                <button className={ui.pagination}>Prev</button>
                <button className={ui.pagination}>Next</button>
            </div>
        </div>
    )
}

export const EmployeeContainer = (props) => {

    const workers = props.employee

    return (
        <div className={ui.content}>
            <EmployeeList
                employees={workers}
            />
            {
                workers.map(w => {

                    return <Employee
                        key={w.id}
                        id={w.id}
                        fullName={w.fullName}
                        position={w.position}
                        email={w.email}
                        pdp={w.pdp}
                    />
                })
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        employee: state.employee.employee
    }
}

export const EmployeeComposer = compose(
    connect(mapStateToProps)
)(EmployeeContainer)
