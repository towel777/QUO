import ui from './ui.module.css'
import {compose} from "redux";
import {connect} from "react-redux";
import {useState} from "react";
import {useMount} from "react-use";

const ImproveSkills = ({
                           juniorTests,
                           middleTests,
                           seniorTests,
                           setModalActive,
                           warning,
                           selectedVisibleLevel,
                           setSelectedVisibleLevel,
                           chooseTest,
                           selectedLevel}) => {


    return (
        <div className={ui.content} onClick={() => setModalActive(false)}>
            <div className={ui.modal} onClick={e => e.stopPropagation()}>
                <h1 className={ui.header}>Choosing a position and test</h1>
                <ul className={`${ui.list} ${ui.listHeader}`}>
                    <li className={ui.listEl}>Experts number</li>
                    <li className={ui.listEl}>Experts name</li>
                    <li className={ui.listEl}>Skills name</li>
                </ul>
                <ul className={`${ui.list} ${ui.listBot}`}>
                    <li className={ui.listEl}>Expert 1</li>
                    <li className={ui.listEl}>Iva N N</li>
                    <li className={ui.listEl}>Soft skills</li>
                </ul>
                {!selectedVisibleLevel && <LevelContainer chooseTest={chooseTest}/>}
                {selectedVisibleLevel && <TestsListContainer
                    juniorTests={juniorTests}
                    middleTests={middleTests}
                    seniorTests={seniorTests}
                    selectedLevel={selectedLevel}
                    warning={warning}
                />}
                {selectedVisibleLevel && <button onClick={() => setSelectedVisibleLevel(false)} className={ui.btn}>Back</button>}
            </div>
        </div>
    )
}

const ImproveSkillsContainer = ({juniorTests, middleTests, seniorTests, setModalActive, warning}) => {

    const [selectedVisibleLevel, setSelectedVisibleLevel] = useState(false)
    const [selectedLevel, setSelectedLevel] = useState(null)

    const chooseTest = (levelName) => {
        setSelectedLevel(levelName)
        setSelectedVisibleLevel(true)
    }

    return (
        <ImproveSkills
            juniorTests={juniorTests}
            middleTests={middleTests}
            seniorTests={seniorTests}
            setModalActive={setModalActive}
            warning={warning}
            selectedVisibleLevel={selectedVisibleLevel}
            setSelectedVisibleLevel={setSelectedVisibleLevel}
            chooseTest={chooseTest}
            selectedLevel={selectedLevel}/>
    )
}

const Level = ({levelName, chooseTest}) => {
    return (
        <div className={ui.chooseContent}>
            <div className={ui.chooseText}>{levelName}</div>
            <button onClick={() => chooseTest(levelName)} className={ui.chooseBtn}>Choose</button>
        </div>
    )
}
const LevelContainer = ({chooseTest}) => {

    return (
        <div className={ui.chooseBox}>
            <h2 className={ui.chooseHeader}>Choose level</h2>
            <div>
                <Level levelName={'Junior'} chooseTest={chooseTest}/>
                <Level levelName={'Middle'} chooseTest={chooseTest}/>
                <Level levelName={'Senior'} chooseTest={chooseTest}/>
            </div>
        </div>

    )
}

const TestsList = ({id, name, level, time, questions, warning}) => {
    return (
        <div className={ui.chooseContent}>
            <div className={ui.chooseText}>{name}</div>
            <button onClick={() => warning(id, name, level, time, questions)} className={ui.chooseBtn}>Choose</button>
        </div>
    )
}

const TestsListContainer = ({juniorTests, middleTests, seniorTests, selectedLevel, warning}) => {

    const [testsList, setTestsList] = useState()

    useMount(() => {
        const testList = (level) => {
            if (level.length !== 0) setTestsList(level)
        }

        switch (selectedLevel) {
            case 'Junior': {
                testList(juniorTests)
                break
            }
            case 'Middle': {
                testList(middleTests)
                break
            }
            case 'Senior': {
                testList(seniorTests)
                break
            }
        }
    })

    return (
        <div className={ui.chooseBox}>
            <h2 className={ui.chooseHeader}>Choose level</h2>
            {testsList
                ? testsList.map(t => {
                    return <TestsList
                        warning={warning}
                        key={t.id}
                        id={t.id}
                        name={t.name}
                        level={t.level}
                        time={t.time}
                        questions={t.questions}/>
                })
                : <div>No tests</div>}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        juniorTests: state.tests.junior,
        middleTests: state.tests.middle,
        seniorTests: state.tests.senior
    }
}

export const ImproveSkillsComposer = compose(connect(mapStateToProps))(ImproveSkillsContainer)
