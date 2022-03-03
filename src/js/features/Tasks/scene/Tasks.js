import ui from  "../ui.module.css"
import {
    sendHeader,
    processHeader,
    finishedHeader,
    send,
    process,
    finished
} from "../svgIcons";
import {compose} from "redux";
import {connect} from "react-redux";
import {dropTask, getTasks, setCurrent} from "../core/tasksReducer";
import FullTask from "./modal/FullTask";
import {useState} from "react";
import {useMount} from "react-use";

const Tasks = ({
                   boards,
                   numberColumn,
                   dragOverHandler,
                   dragStartHandler,
                   dropCardHandler,
                   openFullTask,
                   openModal,
                   setOpenModal,
                   fullTask
}) => {


    return (
        <div className={ui.content}>
            <div className={ui.header}>
                <div className={`${ui.headerEl} ${ui.elementFirst}`}>
                    {sendHeader()}
                    <p>Not taken</p>
                </div>
                <div className={`${ui.headerEl} ${ui.elementSecond}`}>
                    {processHeader()}
                    <p>Process</p>
                </div>
                <div className={`${ui.headerEl} ${ui.elementThird}`}>
                    {finishedHeader()}
                    <p>Finished</p>
                </div>
            </div>
            <div className={ui.columnTasks}>
                {boards.map(board =>
                    <ul
                        className={ui.tasksList}
                        onDragOver={e => dragOverHandler(e)}
                        onDrop={e => dropCardHandler(e,board)}
                        key={board.id}
                    >
                        {board.tasks.map(task =>
                            <li
                                key={task.id}
                                onDragOver={e => dragOverHandler(e)}
                                onDragStart={e => dragStartHandler(e,board,task)}
                                draggable={true}
                                className={ui.tasksEl}
                                onClick={() => openFullTask(task)}
                            >
                                <div className={ui.taskIcon}>{numberColumn(board.id)}</div>
                                <h3 className={ui.taskHeader}>{task.title}</h3>
                                <p className={ui.taskDesc}>{task.description}</p>
                            </li>
                        )}
                    </ul>
                )}
            </div>
            {openModal && <FullTask
                setOpenModal={setOpenModal}
                fullTask={fullTask}
            />}
        </div>
    )
}

export const TasksContainer = (props) => {

    useMount(() => {
        props.getTasks()
    })

    const boards = props.tasks.boards
    const currentBoard = props.tasks.currentBoard
    const currentTask = props.tasks.currentTask

    const numberColumn = (id) => {
        switch (id) {
            case 1:{
                return send()
            }
            case 2:{
                return process()
            }
            case 3:{
                return finished()
            }
            default: return
        }
    }
    const dragOverHandler = (e) => {
        e.preventDefault()
    }

    const dragStartHandler = (e, board, task) => {
        props.setCurrent(board, task)
    }

    const dropCardHandler = (e, board) => {
        board.tasks.push(currentTask)
        currentBoard.tasks.splice(currentBoard.tasks.indexOf(currentTask), 1)
        props.dropTask(
            boards.map(b => {
                if (b.id === board.id) {
                    board.tasks.map(m => m.status = board.tasksStatus)
                    return board
                }
                if (b.id === currentBoard.id) return currentBoard
                return b
            })
        )
    }
    const [openModal, setOpenModal] = useState(false)
    const [fullTask, setFullTask] = useState(null)

    const openFullTask = (task) => {
        setFullTask(task)
        setOpenModal(true)
    }

    return <Tasks
        boards={boards}
        numberColumn={numberColumn}
        dragOverHandler={dragOverHandler}
        dragStartHandler={dragStartHandler}
        dropCardHandler={dropCardHandler}
        openFullTask={openFullTask}
        openModal={openModal}
        setOpenModal={setOpenModal}
        fullTask={fullTask}
    />
}
const mapStateToProps = (state) => {
    return {
        tasks: state.tasks
    }
}


export const TasksComposer = compose(connect(mapStateToProps, {setCurrent, dropTask, getTasks}))(TasksContainer)
