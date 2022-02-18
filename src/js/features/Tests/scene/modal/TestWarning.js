import ui from "../../ui.module.css";

const TestWarning = ({startTest, setTestWarning}) => {
    return (
        <div className={ui.modalContent} onClick={() => setTestWarning(false)}>
            <div className={ui.modal} onClick={e => e.stopPropagation()}>
                <h1>Warning</h1>
                <p>When the test page is closed, all data will be sent for verification. Please complete the test to the end.</p>
                <p>Good luck.</p>
                <div className={ui.modalBtnBox}>
                    <button className={ui.modalBtn} onClick={startTest}>OK</button>
                </div>
            </div>
        </div>
    )
}

export const TestWarningContainer = ({setTestWarning, startTest}) => {
    return <TestWarning setTestWarning={setTestWarning} startTest={startTest} />
}
