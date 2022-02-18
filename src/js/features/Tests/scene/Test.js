import ui from '../ui.module.css'
import {useMount, useUnmount} from "react-use";
import {compose} from "redux";
import {connect} from "react-redux";
import {Field, Form} from "react-final-form";
import {useEffect, useState} from "react";
import {startedQuestion, updateQuestionAnswer, updateQuestionCondition} from "../core/testReducer";
import {useInterval} from "../../../hooks/useInterval";

const TestIconContainer = ({questions, testSelection}) => {

    const setColor = (condition) => {
        switch (condition) {
            case 'start': {
                return ui.testStartedIcon
            }
            case 'finished': {
                return ui.testFinishedIcon
            }
            default: return ui.testWaitingIcon
        }
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
                    {sortedQuestions.map(t => {return <Icon key={t.id} id={t.id} number={t.number} condition={t.condition} setColor={setColor} testSelection={testSelection}/>})}
                </div>
            </div>
        </div>
    )
}
const Icon = ({id, number, condition, setColor, testSelection}) => {
    return <div onClick={() => testSelection(id)} className={`${setColor(condition)} ${ui.testIcon}`}>{number}</div>
}

const TestContainer = ({
                           testName,
                           finishedQuestion,
                           selectedQuestion,
                           startedQuestion,
                           updateQuestionAnswer,
                           updateQuestionCondition
                        }) => {

    const isEmpty = finishedQuestion.length === 0

    useEffect(() => {
        selectedQuestion && startedQuestion(selectedQuestion)
    }, [selectedQuestion]);


    const onSubmit = e => {
        updateQuestionAnswer(selectedQuestion.id, e.answerField)
        updateQuestionCondition(selectedQuestion.id, 'finished')

    }


    const required = value => {
        if (value === undefined) return 'The field should not be empty'
    }

    return (
        <div className={`${ui.testsBox} ${ui.testContainer}`}>
            <h2 className={ui.testsHeader}>{testName}</h2>
            <div className={`${ui.testsList} ${ui.testBox}`}>
                {selectedQuestion && <Test
                    id={selectedQuestion.id}
                    description={selectedQuestion.description}
                    number={selectedQuestion.number}
                    required={required}
                    onSubmit={onSubmit}
                />}
            </div>
        </div>
    )
}

const Test =({description, number, required, onSubmit}) => {
    return (
        <div className={ui.test}>
            <h2 className={ui.testQuestion}>{`${number}.${description}`}</h2>
            <p className={ui.testIndication}>Enter the answer below</p>
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, getValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="answerField" validate={required} getValue={getValue}>
                            {({ input, meta }) => (
                                <div>
                                    <input className={`${ui.input} ${meta.error && meta.touched && ui.inputError}`} {...input} type="text" placeholder="Response field" />
                                    {meta.error && meta.touched && <span className={ui.textError} >{meta.error}</span>}
                                </div>
                            )}
                        </Field>
                        <button className={ui.button} type="submit">Answer</button>
                    </form>
                )}
            />
        </div>
    )
}

const TimerContainer = ({time}) => {

    const ONE_SECOND = 1
    const ONE_MINUTE = ONE_SECOND * 60
    const ONE_HOURS = ONE_MINUTE * 60

    const allTime = time * ONE_MINUTE

    const formatTime = value => value > 9 ? value : `0${value}`;

    const [timeLeft, setTimeLeft] = useInterval(allTime, 1000);

    const hours = formatTime(Math.floor(timeLeft / ONE_HOURS))
    const minutes = formatTime(Math.floor((timeLeft - hours * ONE_HOURS) / ONE_MINUTE))
    const seconds = formatTime(timeLeft - minutes * ONE_MINUTE - hours * ONE_HOURS)

    const handleStartTimer = () => {
        setTimeLeft(ONE_HOURS);
    };

    return (
        <div className={`${ui.testsBox} ${ui.timerContainer}`}>
            <h2 className={ui.testsHeader}>Timer</h2>
            <Timer timeLeft={timeLeft} hours={hours} minutes={minutes} seconds={seconds} />
        </div>
    )
}

const Timer = ({timeLeft, hours, minutes, seconds}) => {
    return (
        <div className={ui.timer}>
            {
                timeLeft > 0 && <div className={ui.time}>
                    <p className={ui.clock}>{hours}</p>
                    <p>:</p>
                    <p className={ui.clock}>{minutes}</p>
                    <p>:</p>
                    <p className={ui.clock}>{seconds}</p>
                </div>
            }
            <button className={ui.button}>Complete the test</button>
        </div>
    )
}

export const TestsContainer = ({
                                   testName,
                                   questions,
                                   finishedQuestion,
                                   time,
                                   updateQuestionCondition,
                                   startedQuestion,
                                   updateQuestionAnswer
                                }) => {

    useUnmount(() => console.log('this close'))

    const [selectedQuestion, setSelectedQuestion] = useState(null)

    useMount(() => {
        setSelectedQuestion(questions[0])
        updateQuestionCondition(questions[0].id, 'start')
    })

    const testSelection = (id) => {
        questions.map(t => {
            if (t.id === id) {
                setSelectedQuestion(t)
                updateQuestionCondition(t.id, 'start')
            }
        })
    }

    return (
        <div className={ui.content}>
            <div className={ui.box}>
                <TestIconContainer questions={questions} testSelection={testSelection} />
                <TestContainer
                    testName={testName}
                    questions={questions}
                    finishedQuestion={finishedQuestion}
                    selectedQuestion={selectedQuestion}
                    startedQuestion={startedQuestion}
                    updateQuestionAnswer={updateQuestionAnswer}
                    updateQuestionCondition={updateQuestionCondition}
                />
                <TimerContainer time={time}/>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        questions: state.test.questions,
        testName: state.test.name,
        time: state.test.time,
        finishedQuestion: state.test.finishedQuestion
    }
}

export const TestsComposer = compose(connect(mapStateToProps, {updateQuestionCondition, updateQuestionAnswer, startedQuestion}))(TestsContainer)
