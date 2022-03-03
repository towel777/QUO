import {compose} from "redux";
import {connect} from "react-redux";
import {getAllPositions, postNewEmployee} from "../../../Employee/core/employeeReducer";
import ui from "../../../Tests/scene/admin/ui.module.css";
import uiAddEmployee from '../../uiAddEmployee.module.css';
import {Field, Form} from "react-final-form";
import {useMount} from "react-use";


const AddEmployee = ({onSubmit, required, emailRequired}) => {

    return (
        <Form
            onSubmit={onSubmit}
            initialValues={
                {
                    employeeStatus: false,
                    employeePosition: "Junior"
                }
            }
            render={({ handleSubmit, getValue }) => (
                <form className={uiAddEmployee.box} onSubmit={handleSubmit}>
                    <Field name="nameEmployee" validate={required} getValue={getValue}>
                        {({ input, meta }) => (
                            <div>
                                <input className={`${uiAddEmployee.input} ${meta.error && meta.touched && uiAddEmployee.inputError}`} {...input} type="text" placeholder="Name" />
                                {meta.error && meta.touched && <span className={uiAddEmployee.textError} >{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <Field name="emailEmployee" validate={emailRequired} getValue={getValue}>
                        {({ input, meta }) => (
                            <div>
                                <input className={`${uiAddEmployee.input} ${meta.error && meta.touched && uiAddEmployee.inputError}`} {...input} type="email" placeholder="Email" />
                                {meta.error && meta.touched && <span className={uiAddEmployee.textError} >{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <div className={uiAddEmployee.select}>
                        <Field name="employeePosition" component="input" type="radio" value="8" />
                        <label>Junior</label>
                    </div>
                    <div className={uiAddEmployee.select}>
                        <Field name="employeePosition" component="input" type="radio" value="9" />
                        <label>Middle</label>
                    </div>
                    <div className={uiAddEmployee.select}>
                        <Field name="employeePosition" component="input" type="radio" value="10" />
                        <label>Senior</label>
                    </div>
                    <div className={uiAddEmployee.select}>
                        <Field name="employeeStatus" component="input" type="checkbox" />
                        <label>Admin</label>
                    </div>
                    <div className={uiAddEmployee.btnBox}>
                        <button className={uiAddEmployee.btn} type="submit">Add</button>
                    </div>
                </form>
            )}
        />

    )
}

const AddEmployeeContainer = ({postNewEmployee, setAddEmployeeModal, getAllPositions, authentification}) => {

    useMount(() => {
        getAllPositions(authentification)
    })

    const onSubmit = e => {
        const newEmployeeData = {
            session_token: authentification,
            email: e.emailEmployee,
            full_name: e.nameEmployee,
            admin_status: e.employeeStatus,
            position:
                {
                    position_id: e.employeePosition
                }
        }


        postNewEmployee(newEmployeeData)
    }


    const required = value => {
        if (value === undefined) return 'The field should not be empty'
    }

    const emailRequired = value => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value === undefined) return 'The field should not be empty'
        if (!value.match(re)) return 'Invalid mail'
    }

    return (
        <div className={`${ui.content} ${uiAddEmployee.content}`} onClick={() => {
            setAddEmployeeModal(false)
        }}>
            <div className={uiAddEmployee.modal} onClick={e => e.stopPropagation()}>
                <AddEmployee emailRequired={emailRequired} postNewEmployee={postNewEmployee} onSubmit={onSubmit} required={required} />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        state: state,
        authentification: state.authentification.session_token
    }
}

export const AddEmployeeComposer = compose(
    connect(mapStateToProps, {postNewEmployee, getAllPositions})
)(AddEmployeeContainer)

