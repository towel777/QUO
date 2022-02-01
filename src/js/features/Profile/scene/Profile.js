import ui from "../ui.module.css"
import ImproveSkills from "./Modal/ImproveSkills";
import {useState} from "react";
import Tests from "../../Tests/scene/Tests";
import {connect} from "react-redux";
import {compose} from "redux";

export const Profile = (props) => {

    return (
        <div className={ui.box} >
            <div className={`${ui.info} ${ui.name}`}>{props.fullName}</div>
            <div className={ui.infoList}>
                <div className={ui.info}>{props.position}</div>
                <div className={ui.info}>{props.email}</div>
                <div className={ui.info}>{props.pdp}</div>
            </div>
            <button className={ui.btn} onClick={() => props.setModalActive(true)}>Improve skills</button>
            {props.modalActive && <ImproveSkills startTest={props.startTest} modalActive={props.modalActive} setModalActive={props.setModalActive} />}
            {props.isActiveTests && <Tests />}
        </div>
    )
}

export const ProfileContainer = (props) => {
    const [modalActive, setModalActive] = useState(false)
    const [isActiveTests, setActiveTests] = useState(false)

    const startTest = () => {
        setActiveTests(true)
        setModalActive(false)
    }

    return <Profile
        startTest={startTest}
        modalActive={modalActive}
        isActiveTests={isActiveTests}
        setModalActive={setModalActive}
        setActiveTests={setActiveTests}
        fullName={props.fullName}
        position={props.position}
        email={props.email}
        pdp={props.pdp}
        status={props.status}
    />
}
const mapStateToProps = (state) => {
    return {
        id: state.profile.id,
        fullName: state.profile.fullName,
        position: state.profile.position,
        email: state.profile.email,
        pdp: state.profile.pdp,
        status: state.profile.status
    }
}

export const ProfileComposer = compose(connect(mapStateToProps))(ProfileContainer)

