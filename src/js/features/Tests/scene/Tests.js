import ui from '../ui.module.css'
import Test from "./Test";

const Tests = () => {
    return (
        <div className={ui.content}>
            <div className={ui.box}>
                <div className={ui.numTests}>
                    <div className={ui.testsIconBox}>
                        <h2 className={ui.testsIconHeader}>List of questions</h2>
                        <div className={ui.testsIconsList}>
                            <div className={ui.testIcon}>1</div>
                            <div className={ui.testIcon}>2</div>
                            <div className={ui.testIcon}>3</div>
                            <div className={ui.testIcon}>4</div>
                            <div className={ui.testIcon}>5</div>
                            <div className={ui.testIcon}>6</div>
                            <div className={ui.testIcon}>7</div>
                            <div className={ui.testIcon}>8</div>
                            <div className={ui.testIcon}>9</div>
                        </div>
                    </div>
                </div>
                <Test />
                <div className={ui.timeOut}>
                    <p>12333333333333333333333333333333333333333333333333333344</p>
                </div>
            </div>
        </div>
    )
}

export default Tests
