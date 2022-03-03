import {useState} from "react";
import ui from './ui.module.css'
import uiTest from '../ui.module.css'
import {compose} from "redux";
import {connect} from "react-redux";
import {getResultTests} from "./core/resultTestReducer";
import {useMount, useUnmount} from "react-use";

const QuestionsContainer = ({selectedCheckTest}) => {
    return (
        <div className={`${ui.questions} ${uiTest.testsBox} ${uiTest.testContainer}`}>
            {selectedCheckTest
                ? <div>
                    <h2 className={uiTest.testsHeader}>{selectedCheckTest[0].name}</h2>
                    <div className={`${uiTest.testsList} ${uiTest.testBox} ${ui.questionsContent}`}>
                        <div className={ui.questionBox}>
                            {selectedCheckTest[0].questions.map(s => {return <Questions key={s.id} description={s.description} />})}
                        </div>
                        <Time />
                    </div>
                    <button>Failed</button>
                    <button>Passed</button>
                </div>
                : <p>Waiting</p> }
        </div>

    )
}

const Questions = ({description}) => {
    return (
        <div className={ui.question}>
            <p>Question: {description}</p>
            <p>Answer: </p>
            <p>Incorrect</p>
        </div>
    )
}

const Time = () => {
    return (
        <div>
            <p>Time: 15 min</p>
        </div>
    )
}

const ResultTestsContainer = ({setSelectedCheckTest, selectedCheckTest}) => {
    return (
        <div className={uiTest.content}>
            <div className={uiTest.box}>
                <QuestionsContainer selectedCheckTest={selectedCheckTest}/>
            </div>
        </div>

    )
}

const Modal = ({setActiveModal, startCheckTest, getResultTests, resultTests}) => {

    useMount(() => {
        getResultTests()
    })

    return (
        <div className={ui.content} onClick={() => {setActiveModal(false)}}>
            <div className={ui.modal} onClick={e => e.stopPropagation()}>
                <h1 className={ui.header}>Tests list</h1>
                <div className={ui.chooseBox}>
                    <h2 className={ui.chooseHeader}>Create or edit test</h2>
                    {resultTests.length !== 0 && resultTests.map(r => {
                        return (
                            <div key={r.id} className={ui.chooseContent}>
                                <div className={ui.chooseText}>{r.name}</div>
                                <button onClick={() => startCheckTest(r.id)} className={ui.chooseBtn}>Check</button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export const ResultContainer = ({buttonUi, getResultTests, resultTests}) => {

    const [activeModal, setActiveModal] = useState(false)
    const [activeTest, setActiveTest] = useState(false)
    const [selectedCheckTest, setSelectedCheckTest] = useState(null)

    const startCheckTest = (id) => {
        setActiveModal(false)
        setSelectedCheckTest(resultTests.filter(r => r.id === id))
        setActiveTest(true)
    }

    return (
        <div className={ui.prevButton} >
            {activeModal && <Modal resultTests={resultTests} getResultTests={getResultTests} startCheckTest={startCheckTest} setActiveModal={setActiveModal} />}
            {activeTest && <ResultTestsContainer setSelectedCheckTest={setSelectedCheckTest} selectedCheckTest={selectedCheckTest} />}
            <button className={buttonUi} onClick={() => setActiveModal(true)}>Result tests</button>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        resultTests: state.resultTest.resultTests
    }
}

export const ResultComposer = compose(connect(mapStateToProps, {getResultTests}))(ResultContainer)

