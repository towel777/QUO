import {Field, Form} from "react-final-form";
import ui from "../../Tests/ui.module.css";


const CreateCompany = ({createNewCompany}) => {

    const onSubmit = e => {
        const info = {
            name:  e.companyNameField,
            employee: [
                {
                    email: e.companyEmail,
                    psw:  e.companyPassword,
                    full_name: e.companyAdminName
                }
            ],
            positions: [
                {position: "Junior"},
                {position: "Middle"},
                {position: "Senior"}
            ]
        }
        createNewCompany(info)
    }

    const required = value => {
        if (value === undefined) return 'The field should not be empty'
    }
    const requiredEmail = value => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value === undefined) return 'The field should not be empty'
        if (!value.match(re)) return 'Invalid mail'
    }

    return (
        <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, getValue }) => (
                <form onSubmit={handleSubmit}>
                    <Field name="companyNameField" validate={required} getValue={getValue}>
                        {({ input, meta }) => (
                            <div>
                                <input className={`${ui.input} ${meta.error && meta.touched && ui.inputError}`} {...input} type="text" placeholder="Company name" />
                                {meta.error && meta.touched && <span className={ui.textError} >{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <Field name="companyEmail" validate={requiredEmail} getValue={getValue}>
                        {({ input, meta }) => (
                            <div>
                                <input className={`${ui.input} ${meta.error && meta.touched && ui.inputError}`} {...input} type="text" placeholder="Email" />
                                {meta.error && meta.touched && <span className={ui.textError} >{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <Field name="companyPassword" validate={required} getValue={getValue}>
                        {({ input, meta }) => (
                            <div>
                                <input className={`${ui.input} ${meta.error && meta.touched && ui.inputError}`} {...input} type="text" placeholder="Password" />
                                {meta.error && meta.touched && <span className={ui.textError} >{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <Field name="companyAdminName" validate={required} getValue={getValue}>
                        {({ input, meta }) => (
                            <div>
                                <input className={`${ui.input} ${meta.error && meta.touched && ui.inputError}`} {...input} type="text" placeholder="Name" />
                                {meta.error && meta.touched && <span className={ui.textError} >{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <button className={ui.button} type="submit">Create</button>
                </form>
            )}
        />
    )
}

export default CreateCompany
