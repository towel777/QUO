import ui from  "../ui.module.css"
import {
    sendHeader,
    processHeader,
    finishedHeader,
    send,
    process,
    finished
} from "../svgIcons";
import {useState} from "react";
import {compose} from "redux";
import {connect} from "react-redux";

const Tasks = ({board, numberColumn, dragOverHandler, dragStartHandler, dropCardHandler}) => {


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
                {board.map(board =>
                    <ul
                        className={ui.tasksList}
                        onDragOver={e => dragOverHandler(e)}
                        onDrop={e => dropCardHandler(e,board)}
                    >
                        {board.tasks.map(item =>
                            <li
                                onDragOver={e => dragOverHandler(e)}
                                onDragStart={e => dragStartHandler(e,board,item)}
                                draggable={true}
                                className={ui.tasksEl}
                            >
                                <div className={ui.taskIcon}>{numberColumn(board.id)}</div>
                                <h3 className={ui.taskHeader}>{item.title}</h3>
                                <p className={ui.taskDesc}>{item.description}</p>
                            </li>
                        )}
                    </ul>
                )}
            </div>
            {/*<div className={ui.columnTasks}>*/}
            {/*    {boards.map(board =>*/}
            {/*        <ul*/}
            {/*            className={ui.tasksList}*/}
            {/*            onDragOver={e => dragOverHandler(e)}*/}
            {/*            onDrop={e => dropCardHandler(e,board)}*/}
            {/*        >*/}
            {/*            {board.items.map(item =>*/}
            {/*                <li*/}
            {/*                    onDragOver={e => dragOverHandler(e)}*/}
            {/*                    onDragStart={e => dragStartHandler(e,board,item)}*/}
            {/*                    draggable={true}*/}
            {/*                    className={ui.tasksEl}*/}
            {/*                >*/}
            {/*                    <div className={ui.taskIcon}>{numberColumn(board.id)}</div>*/}
            {/*                    <h3 className={ui.taskHeader}>{item.title}</h3>*/}
            {/*                    <p className={ui.taskDesc}>{item.description}</p>*/}
            {/*                </li>*/}
            {/*            )}*/}
            {/*        </ul>*/}
            {/*    )}*/}
            {/*</div>*/}
        </div>
    )
}

export const TasksContainer = ({tasks}) => {
    const board = tasks.boards
    console.log(board)
    const [boards, setBoards] = useState([
        {id: 1, items: []},
        {id: 2, items: []},
        {id: 3, items: []}
    ])


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

    const dragStartHandler = (e, board) => {
        test(board)
    }

    const dropCardHandler = (e, board) => {
        board.items.push(currentItem)
        const currentIndex = currentBoard.items.indexOf(currentItem)
        currentBoard.items.splice(currentIndex, 1)
        setBoards(boards.map(b => {
            if (b.id === board.id) return board
            if (b.id === currentBoard.id) return currentBoard
            return b
        }))
    }

    return <Tasks
        board={board}
        boards={boards}
        numberColumn={numberColumn}
        dragOverHandler={dragOverHandler}
        dragStartHandler={dragStartHandler}
        dropCardHandler={dropCardHandler}
    />
}
const mapStateToProps = (state) => {
    return {
        tasks: state.tasks
    }
}

export const TasksComposer = compose(connect(mapStateToProps))(TasksContainer)
