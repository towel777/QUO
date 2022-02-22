import ui from './ui.module.css'
import {compose} from "redux";
import {connect} from "react-redux";
import {useEffect, useState} from "react";
import {deleteCreatedTest, getCreatedTests, setIsFetching} from "../../core/admin/createTestsReducer";
import {CreateTestComposer} from "./test/CreateTest";
import {createNewTest, setCreatedTest} from "../../core/admin/createTestReducer";

const CreateLevelContainer = ({selectTestsLevel}) => {
    return (
        <div>
            <CreateLevel selectTestsLevel={selectTestsLevel} levelName={'Junior'} />
            <CreateLevel selectTestsLevel={selectTestsLevel} levelName={'Middle'} />
            <CreateLevel selectTestsLevel={selectTestsLevel} levelName={'Senior'} />
        </div>
    )
}

const CreateLevel = ({levelName, selectTestsLevel}) => {
    return (
        <div className={ui.chooseContent}>
            <div className={ui.chooseText}>{levelName}</div>
            <button onClick={() => selectTestsLevel(levelName)} className={ui.chooseBtn}>Choose</button>
        </div>
    )
}

const CreateOrEditTestContainer = ({
                                       tests,
                                       selectedLevel,
                                       deleteCreatedTest,
                                       setIsFetching,
                                       isFetching,
                                       setCreatedTest,
                                       setStartCreateTest,
                                       setStartCreateTestPreview}) => {

    const [createTestsList, setCreateTestsList] = useState([])

    useEffect(() => {
        const testList = (level) => {
            if (level.length !== 0) setCreateTestsList(level)
            else setCreateTestsList([])
        }

        switch (selectedLevel) {
            case 'Junior': {
                testList(tests.junior)
                break
            }
            case 'Middle': {
                testList(tests.middle)
                break
            }
            case 'Senior': {
                testList(tests.senior)
                break
            }
            default:
                return
        }

    }, [tests, isFetching])

    const deleteTest = (id) => {
        setIsFetching(true)
        deleteCreatedTest(id)
    }

    const selectTestForEdit = (id, createTestsList) => {
        setCreatedTest(createTestsList.filter(t => t.id === id))
        setStartCreateTest(true)
        setStartCreateTestPreview(false)
    }

    return (
        <div className={ui.CreateOrEditTestContainer}>
            {isFetching ? <div>123</div> : createTestsList.length !== 0
                ? createTestsList.map(t => {
                    return <CreateOrEditTest
                        createTestsList={createTestsList}
                        selectTestForEdit={selectTestForEdit}
                        key={t.id}
                        id={t.id}
                        name={t.name}
                        deleteTest={deleteTest}/>
                })
                : <div>No tests</div>
            }
        </div>
    )
}

const CreateOrEditTest = ({name, id, deleteTest, selectTestForEdit, createTestsList}) => {

    return (
        <div className={ui.chooseContent}>
            <div className={ui.chooseText}>{name}</div>
            <div className={ui.btnBox}>
                <button onClick={() => selectTestForEdit(id, createTestsList)} className={`${ui.chooseBtn}`}>Edit</button>
                <button onClick={() => deleteTest(id)} className={`${ui.chooseBtn} ${ui.deleteBtn}`}>Delete</button>
            </div>
        </div>
    )
}

const PreviewModal = ({
                          tests,
                          setStartCreateTestPreview,
                          chooseLevel,
                          setChooseLevel,
                          selectTestsLevel,
                          selectedLevel,
                          deleteCreatedTest,
                          setIsFetching,
                          isFetching,
                          startCreateNewTest,
                          setCreatedTest,
                          setStartCreateTest
}) => {
    return (
        <div className={ui.content} onClick={() => {
            setStartCreateTestPreview(false)
            setChooseLevel(false)
        }}>
            <div className={ui.modal} onClick={e => e.stopPropagation()}>
                <h1 className={ui.header}>Tests list</h1>
                <div className={ui.chooseBox}>
                    <h2 className={ui.chooseHeader}>Create or edit test</h2>
                    <div>
                        {chooseLevel
                            ? <CreateOrEditTestContainer
                                isFetching={isFetching}
                                setIsFetching={setIsFetching}
                                deleteCreatedTest={deleteCreatedTest}
                                tests={tests}
                                selectedLevel={selectedLevel}
                                startCreateNewTest={startCreateNewTest}
                                setCreatedTest={setCreatedTest}
                                setStartCreateTest={setStartCreateTest}
                                setStartCreateTestPreview={setStartCreateTestPreview}/>
                            : <CreateLevelContainer selectTestsLevel={selectTestsLevel}/>}
                    </div>
                </div>
                <div className={ui.buttonBox}>
                    {chooseLevel && <button onClick={() => setChooseLevel(false)} className={ui.btn}>Back</button>}
                    <button onClick={() => startCreateNewTest()} className={ui.btn}>New test</button>
                </div>
            </div>
        </div>
    )
}

const PreviewModalContainer = ({
                                   tests,
                                   classButton,
                                   getCreatedTests,
                                   deleteCreatedTest,
                                   setIsFetching,
                                   isFetching,
                                   createNewTest,
                                   setCreatedTest
}) => {
    const [startCreateTest, setStartCreateTest] = useState(false)
    const [startCreateTestPreview, setStartCreateTestPreview] = useState(false)
    const [chooseLevel, setChooseLevel] = useState(false)
    const [selectedLevel, setSelectedLevel] = useState(null)

    const selectTestsLevel = (levelName) => {
        setSelectedLevel(levelName)
        setChooseLevel(true)
    }

    const startCreateTests = () => {
        getCreatedTests()
        setStartCreateTestPreview(true)
    }

    const startCreateNewTest = () => {
        createNewTest([tests.junior, tests.middle, tests.senior])
        setStartCreateTest(true)
        setStartCreateTestPreview(false)
    }

    return (
        <div className={ui.previewVisible}>
            {startCreateTestPreview && <PreviewModal
                tests={tests}
                selectTestsLevel={selectTestsLevel}
                chooseLevel={chooseLevel}
                setChooseLevel={setChooseLevel}
                setStartCreateTest={setStartCreateTest}
                setStartCreateTestPreview={setStartCreateTestPreview}
                selectedLevel={selectedLevel}
                deleteCreatedTest={deleteCreatedTest}
                setIsFetching={setIsFetching}
                isFetching={isFetching}
                startCreateNewTest={startCreateNewTest}
                setCreatedTest={setCreatedTest}/>}
            {startCreateTest &&  <CreateTestComposer setStartCreateTest={setStartCreateTest} />}
            <button className={classButton} onClick={() => startCreateTests()}>Create tests</button>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        tests: state.createTests,
        isFetching: state.createTests.isFetching
    }
}

export const CreateTestsComposer = compose(connect(mapStateToProps,
    {
        getCreatedTests,
        deleteCreatedTest,
        setIsFetching,
        createNewTest,
        setCreatedTest
    }))(PreviewModalContainer)
