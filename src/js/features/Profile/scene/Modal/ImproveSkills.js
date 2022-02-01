import ui from './ui.module.css'

const ImproveSkills = ({setModalActive, startTest}) => {


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
                <Level />
                <div className={ui.btnBox}>
                    <button onClick={startTest} className={ui.btn}>Next</button>
                </div>
            </div>
        </div>
    )
}

export default ImproveSkills

const Level = () => {
    return (
        <div className={ui.chooseBox}>
            <h2 className={ui.chooseHeader}>Choose level</h2>
            <div className={ui.chooseContent}>
                <div className={ui.chooseText}>Junior</div>
                <button className={ui.chooseBtn}>Choose</button>
            </div>
        </div>
    )
}

// const test = () => {
//     return (
//         <div className={ui.chooseBox}>
//             <h2 className={ui.chooseHeader}>Choose level</h2>
//             <div className={ui.chooseContent}>
//                 <div className={ui.chooseText}>Junior</div>
//                 <button className={ui.chooseBtn}>Choose</button>
//             </div>
//         </div>
//     )
// }
