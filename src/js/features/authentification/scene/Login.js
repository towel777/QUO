import {Field, Form} from "react-final-form";
import ui from "../../Tests/ui.module.css";


const Login = ({postLoginAuthentication}) => {

    const onSubmit = e => {
        postLoginAuthentication(e.emailField, e.passwordField)
    }

    const requiredEmail = value => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value === undefined) return 'The field should not be empty'
        if (!value.match(re)) return 'Invalid mail'
    }
    const requiredPassword = value => {
        if (value === undefined) return 'The field should not be empty'
    }

    return(
        <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, getValue }) => (
                <form onSubmit={handleSubmit}>
                    <Field name="emailField" validate={requiredEmail} getValue={getValue}>
                        {({ input, meta }) => (
                            <div>
                                <input className={`${ui.input} ${meta.error && meta.touched && ui.inputError}`} {...input} type="text" placeholder="Email" />
                                {meta.error && meta.touched && <span className={ui.textError} >{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <Field name="passwordField" validate={requiredPassword} getValue={getValue}>
                        {({ input, meta }) => (
                            <div>
                                <input className={`${ui.input} ${meta.error && meta.touched && ui.inputError}`} {...input} type="text" placeholder="Password" />
                                {meta.error && meta.touched && <span className={ui.textError} >{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <button className={ui.button} type="submit">Login</button>
                </form>
            )}
        />
    )
};

export default Login
