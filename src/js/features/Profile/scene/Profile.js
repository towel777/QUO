import ui from "../ui.module.css"
import {ImproveSkillsComposer} from "./Modal/ImproveSkills";
import {useEffect, useState} from "react";
import {TestsComposer} from "../../Tests/scene/Test";
import {connect} from "react-redux";
import {compose} from "redux";
import {TestWarningContainer} from "../../Tests/scene/modal/TestWarning";
import {Icon} from "./admin/Icon";
import {getTests} from "../../Tests/core/testsReducer";
import {setTest} from "../../Tests/core/testReducer";
import {CreateTestsComposer} from "../../Tests/scene/admin/CreateTests";
import {getProfileMe} from "../core/profileReducer";
import {useMount} from "react-use";

export const Profile = ({
    fullName,
    position,
    email,
    pdp,
    warning,
    setTestWarning,
    setModalActive,
    startImprovedSkills,
    startTest,
    isActiveTests,
    testWarning,
    modalActive
}) => {

    return (
        <div className={ui.box} >
            <Icon />
            <div className={`${ui.info} ${ui.name}`}>{fullName}</div>
            <div className={ui.infoList}>
                <div className={ui.info}>{position}</div>
                <div className={ui.info}>{email}</div>
                <div className={ui.info}>{pdp}</div>
            </div>
            <button className={ui.btn} onClick={() => startImprovedSkills()}>Improve skills</button>
            <CreateTestsComposer classButton={ui.btn} />
            {modalActive && <ImproveSkillsComposer warning={warning} setModalActive={setModalActive} />}
            {testWarning && <TestWarningContainer setTestWarning={setTestWarning} startTest={startTest}/>}
            {isActiveTests && <TestsComposer />}
        </div>
    )
}

export const ProfileContainer = ({
    fullName,
    position,
    email,
    pdp,
    status,
    getTests,
    setTest,
    getProfileMe,
    authentification
    }) => {

    useEffect(() => {
        getProfileMe(authentification.session_token)
    }, [authentification])

    const [modalActive, setModalActive] = useState(false)
    const [isActiveTests, setActiveTests] = useState(false)
    const [testWarning, setTestWarning] = useState(false)

    const warning = (id, name, level, time, questions) => {
        setTest(id, name, level, time, questions)
        setModalActive(false)
        setTestWarning(true)

    }

    const startTest = () => {
        setTestWarning(false)
        setActiveTests(true)
    }

    const startImprovedSkills = () => {
        getTests()
        setModalActive(true)

    }

    return <Profile
        startTest={startTest}
        modalActive={modalActive}
        isActiveTests={isActiveTests}
        setModalActive={setModalActive}
        setActiveTests={setActiveTests}
        fullName={fullName}
        position={position}
        email={email}
        pdp={pdp}
        status={status}
        testWarning={testWarning}
        setTestWarning={setTestWarning}
        warning={warning}
        startImprovedSkills={startImprovedSkills}
        getTests={getTests}
    />
}
const mapStateToProps = (state) => {
    return {
        id: state.profile.id,
        fullName: state.profile.fullName,
        position: state.profile.position,
        email: state.profile.email,
        pdp: state.profile.pdp,
        status: state.profile.status,
        tests: state.tests,
        authentification: state.authentification
    }
}

export const ProfileComposer = compose(connect(mapStateToProps, {getTests, setTest, getProfileMe}))(ProfileContainer)

