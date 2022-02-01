import { Form, Field } from 'react-final-form'

const Login = () => {
    return(
        <Form onSubmit={onSubmit}
              render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                      <div>
                          <label>Company name</label>
                          <Field name="companyName" component="input" placeholder="Company name" />
                      </div>
                      <div>
                          <label>Password</label>
                          <Field name="password" component="input" placeholder="Password" />
                      </div>
                      <button>Continue</button>
                  </form>
              )}
        />
    )
};

export default Login
