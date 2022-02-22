import uiCreateTest from "./ui.module.css";
import ui from '../../../ui.module.css'
import {compose} from "redux";
import {connect} from "react-redux";
import {Field, Form} from "react-final-form";
import {
    addQuestion,
    deleteQuestion, postCreatedTest,
    setIconColor,
    setSelectQuestion,
    updateIconColor, updateQuestion
} from "../../../core/admin/createTestReducer";
import {useEffect, useState} from "react";
import {useMount} from "react-use";
import * as R from 'ramda';

const CreateTestsContainer = ({
                                  questions,
                                  selectedQuestion,
                                  setSelectQuestion,
                                  addQuestion,
                                  deleteQuestion,
                                  iconColor,
                                  setIconColor,
                                  updateIconColor,
                                  updateQuestion,
                                  name,
                                  level,
                                  time,
                                  postCreatedTest,
                                  test,
                                  setStartCreateTest
}) => {
    const isNullOrEmpty = (value) => {
        if (value === undefined || value === null) return true

        if (!Number.isInteger(value) && value.trim() === '') return true

        return false
    }

    const requiredTime = value => {
        if (isNullOrEmpty(value)) return 'Field should not be empty'

        if (!Number.isInteger(value) && value.match(/[.,]/)) return 'Only integers'

        if (Number(value) < 0) return 'Only positive number'
    }

    const [modalWarning, setModalWarning] = useState(false)

    const emptyQuestion = () => {
        let empty = false
        questions.map(q => {
            if (isNullOrEmpty(q.description) && isNullOrEmpty(q.answer)) {
                updateIconColor(q.id, 'error')
                empty = true
            }
        })
        if (empty) {
            setModalWarning(true)
            return false
        }
        return true
    }

    const onSubmit = e => {
        if (emptyQuestion(e.timeField, e.testNameField, e.level)) {
            postCreatedTest(test)
            setStartCreateTest(false)
        }
    }

    const requiredInformation = value => {
        if (isNullOrEmpty(value)) return 'Field should not be empty'
    }

    const setColor = (id, iconColor) => {

        let condition
        iconColor.map(i => {
            if (i.id === id) condition = i.condition
        })

        switch (condition) {
            case 'start': {
                return ui.testStartedIcon
            }
            case 'finished': {
                return ui.testFinishedIcon
            }
            case 'error': {
                return uiCreateTest.testErrorIcon
            }
            default: return ui.testWaitingIcon
        }
    }

    const selectQuestion = (id) => {
        setSelectQuestion(id)
        updateIconColor(id, 'start')
    }
    useMount(() => {
        setIconColor(questions)
        updateIconColor(questions[0].id, 'start')
    })

    useEffect(() => {
        setSelectQuestion(questions[0].id)
    }, [questions])

    return <CreateTests
        questions={questions}
        selectQuestion={selectQuestion}
        selectedQuestion={selectedQuestion}
        requiredInformation={requiredInformation}
        onSubmit={onSubmit}
        requiredTime={requiredTime}
        addQuestion={addQuestion}
        deleteQuestion={deleteQuestion}
        setColor={setColor}
        iconColor={iconColor}
        updateIconColor={updateIconColor}
        updateQuestion={updateQuestion}
        name={name}
        level={level}
        time={time}
        isNullOrEmpty={isNullOrEmpty}
        modalWarning={modalWarning}
        setModalWarning={setModalWarning}/>
}

const CreateTests = ({
                         requiredTime,
                         onSubmit,
                         requiredInformation,
                         questions,
                         selectQuestion,
                         selectedQuestion,
                         addQuestion,
                         deleteQuestion,
                         setColor,
                         iconColor,
                         updateQuestion,
                         updateIconColor,
                         name,
                         level,
                         time,
                         isNullOrEmpty,
                         modalWarning,
                         setModalWarning
}) => {

    return (
        <div className={uiCreateTest.testContent}>
            <div className={uiCreateTest.testBox}>
                <CreateTestIconContainer
                    iconColor={iconColor}
                    setColor={setColor}
                    addQuestion={addQuestion}
                    selectQuestion={selectQuestion}
                    questions={questions}/>
                <CreateTestContainer
                    updateIconColor={updateIconColor}
                    setColor={setColor}
                    updateQuestion={updateQuestion}
                    deleteQuestion={deleteQuestion}
                    questions={questions}
                    selectedQuestion={selectedQuestion}
                    isNullOrEmpty={isNullOrEmpty}/>
                <div className={uiCreateTest.rightColumn}>
                    <Form
                        onSubmit={onSubmit}
                        requiredTime={requiredTime}
                        initialValues={
                            {
                                level: level,
                                testNameField: name,
                                timeField: time
                            }
                        }
                        render={({ handleSubmit, getValue }) => (
                            <form onSubmit={handleSubmit}>
                                <TestInformationContainer requiredTime={requiredTime} getValue={getValue} requiredInformation={requiredInformation} />
                            </form>
                        )}
                    />
                </div>
            </div>
            {modalWarning && <CreateTestWarning setModalWarning={setModalWarning} />}
        </div>
    )
}

const CreateTestIconContainer = ({questions, selectQuestion ,addQuestion, setColor, iconColor}) => {

    const addNewQuestion = (questions) => {
        addQuestion(questions)
    }


    const sortedQuestions = questions.sort(function (a, b) {
        if (a.number > b.number) return 1;
        if (a.number < b.number) return -1;
        return 0;
    });

    return (
        <div className={`${ui.testsBox} ${ui.iconContainer}`}>
            <div className={ui.testsIconBox}>
                <h2 className={ui.testsHeader}>List of questions</h2>
                <div className={ui.testsList}>
                    {sortedQuestions.map(q => {
                        return <CreateIcon
                            setColor={setColor}
                            selectQuestion={selectQuestion}
                            key={q.id}
                            id={q.id}
                            number={q.number}
                            condition={q.condition}
                            iconColor={iconColor}
                        />
                    })}
                </div>
                <button onClick={() => addNewQuestion(sortedQuestions)} className={ui.button}>Add question</button>
            </div>
        </div>
    )
}
const CreateIcon = ({id, number, selectQuestion, setColor, iconColor}) => {
    return <div onClick={() => selectQuestion(id)} className={`${ui.testIcon} ${setColor(id, iconColor)}`}>{number}</div>
}

const CreateTestContainer = ({questions, selectedQuestion, deleteQuestion, updateQuestion, updateIconColor, isNullOrEmpty}) => {

    const [questionId, setQuestionId] = useState()

    const deleteCreatedQuestion = () => {
        deleteQuestion(selectedQuestion)
    }

    const updateInformation = (description, answer) => {
        if (!isNullOrEmpty(description) && !isNullOrEmpty(answer)) {
            updateIconColor(questionId, 'finished')
            updateQuestion(questionId, R.trim(description), R.trim(answer))
        }
    }

    const onSubmit = (e) => {
        updateInformation(e.descriptionField, e.answerField)
    }

    const required = value => {
        if (isNullOrEmpty(value)) return 'The field should not be empty'
    }

    return (
        <div className={`${ui.testsBox} ${ui.testContainer}`}>
            <h2 className={ui.testsHeader}>testName</h2>
            <div className={`${ui.testsList} ${ui.testBox}`}>
                {selectedQuestion && questions.map(q => {
                    if (q.id === selectedQuestion.id)
                        return <CreateTest
                            key={q.id}
                            id={q.id}
                            answer={q.answer}
                            description={q.description}
                            deleteCreatedQuestion={deleteCreatedQuestion}
                            onSubmit={onSubmit}
                            required={required}
                            questions={questions}
                            setQuestionId={setQuestionId}
                        />
                })}
            </div>
        </div>
    )
}

const CreateTest = ({
                        questions,
                        onSubmit,
                        required,
                        deleteCreatedQuestion,
                        id,
                        answer,
                        description,
                        setQuestionId
}) => {

    useEffect(() => {
        setQuestionId(id)
    })

    return (
        <div className={ui.test}>
            <Form
                onSubmit={onSubmit}
                initialValues={
                    {
                        descriptionField: description,
                        answerField: answer
                    }
                }
                render={({ handleSubmit, getValue }) => (
                    <form
                        onSubmit={handleSubmit}
                    >
                        <Field name="descriptionField" validate={required} getValue={getValue}>
                            {({ input, meta }) => (
                                <div>
                                    <p className={ui.testIndication}>Enter question</p>
                                    <input className={`${ui.input} ${meta.error && meta.touched && ui.inputError}`} {...input} type="text" placeholder="Question field" />
                                    {meta.error && meta.touched && <span className={ui.textError} >{meta.error}</span>}
                                </div>
                            )}
                        </Field>
                        <Field name="answerField" validate={required} getValue={getValue}>
                            {({ input, meta }) => (
                                <div>
                                    <p className={ui.testIndication}>Enter the answer to question</p>
                                    <input className={`${ui.input} ${meta.error && meta.touched && ui.inputError}`} {...input} type="text" placeholder="Answer field" />
                                    {meta.error && meta.touched && <span className={ui.textError} >{meta.error}</span>}
                                </div>
                            )}
                        </Field>
                        <div className={uiCreateTest.buttonBox}>
                            <button className={ui.button} type="submit">Save</button>
                            {questions.length > 1 && <div onClick={() => deleteCreatedQuestion()} className={`${ui.button} ${uiCreateTest.deleteButton}`}>Delete</div>}

                        </div>
                    </form>
                )}
            />
        </div>
    )
}

const CreateTimerContainer = ({requiredTime, getValue}) => {
    return (
            <CreateTimer getValue={getValue} requiredTime={requiredTime}/>
    )
}

const CreateTimer = ({requiredTime, getValue}) => {
    return (
        <Field name="timeField" validate={requiredTime} getValue={getValue}>
            {({ input, meta }) => (
                <div className={uiCreateTest.inputBox}>
                    <p className={ui.testIndication}>Enter time</p>
                    <input className={`${ui.input} ${uiCreateTest.rightColumnField} ${meta.error && meta.touched && ui.inputError}`}
                           {...input} type="number" placeholder="Min" />
                    {meta.error && meta.touched && <div><span className={`${ui.textError} ${uiCreateTest.textErrorPosition}`} >{meta.error}</span></div>}
                </div>
            )}
        </Field>
    )
}

const TestInformationContainer = ({getValue, requiredInformation, requiredTime}) => {

    return (
        <div className={ui.testsBox}>
            <h2 className={ui.testsHeader}>Test information</h2>
            <CreateTimerContainer getValue={getValue} requiredTime={requiredTime} />
            <TestInformation requiredInformation={requiredInformation} getValue={getValue} />
        </div>
    )
}

const TestInformation = ({getValue, requiredInformation}) => {
    return (
        <div className={`${ui.timer} ${uiCreateTest.testInformation}`}>
            <Field name="testNameField" validate={requiredInformation} getValue={getValue}>
                {({ input, meta }) => (
                    <div className={uiCreateTest.inputBox}>
                        <p className={`${ui.testIndication} ${uiCreateTest.nonTopMargin}`}>Enter test name</p>
                        <input className={`${ui.input} ${uiCreateTest.rightColumnField} ${meta.error && meta.touched && ui.inputError}`}
                               {...input} type="text" placeholder="Test name" />
                        {meta.error && meta.touched && <div><span className={`${ui.textError} ${uiCreateTest.textErrorPosition}`} >{meta.error}</span></div>}
                    </div>
                )}
            </Field>
            <p className={`${ui.testIndication} ${uiCreateTest.nonTopMargin}`}>Enter level</p>
            <SelectLevel />
            <button className={ui.button}>Save the test</button>
        </div>
    )
}

const SelectLevel = () => {
    return (
        <div className={uiCreateTest.selectBox}>
            <div className={uiCreateTest.selectOption}>
                <label>Junior</label>
                <Field name="level" component="input" type="radio" value="Junior" />
            </div>
            <div className={uiCreateTest.selectOption}>
                <label>Middle</label>
                <Field name="level" component="input" type="radio" value="Middle" />
            </div>
            <div className={uiCreateTest.selectOption}>
                <label>Senior</label>
                <Field name="level" component="input" type="radio" value="Senior" />
            </div>
        </div>
    )
}

const CreateTestWarning = ({setModalWarning}) => {
    return (
        <div className={ui.modalContent} onClick={() => setModalWarning(false)}>
            <div className={`${ui.modal} ${uiCreateTest.modalWarning}`} onClick={e => e.stopPropagation()}>
                <h1>Warning</h1>
                <p>Please fill in or delete the marked questions</p>
                <div className={ui.modalBtnBox}>
                    <button className={ui.modalBtn} onClick={() => setModalWarning(false)}>OK</button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        test: state.createTest.test,
        questions: state.createTest.test.questions,
        name: state.createTest.test.name,
        level: state.createTest.test.level,
        time: state.createTest.test.time,
        selectedQuestion: state.createTest.selectedQuestion,
        iconColor: state.createTest.iconColor
    }
}

export const CreateTestComposer = compose(connect(
    mapStateToProps,
    {setSelectQuestion,
        addQuestion,
        deleteQuestion,
        setIconColor,
        updateIconColor,
        updateQuestion,
        postCreatedTest
    }
))(CreateTestsContainer)
