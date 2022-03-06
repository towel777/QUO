import ui from '../ui.module.css'
import Login from "./Login";
import {compose} from "redux";
import {connect} from "react-redux";
import {createNewCompany, postLoginAuthentication} from "../core/authentificationReducer";
import CreateCompany from "./CreateCompany";
import {useState} from "react";
import {getLogotypeIcon} from "../../../../icons/logotype";


const Authentification = ({postLoginAuthentication, createNewCompany}) => {

    const [registration, setRegistration] = useState(false)

    return (
        <div className={ui.content}>
            <div className={ui.box}>
                <header className={ui.logotypeBox}>
                    {getLogotypeIcon(50, 50)}
                    <h1>QUO</h1>
                </header>
                <h1>Authentication form</h1>
                {registration ? <CreateCompany createNewCompany={createNewCompany} /> : <Login postLoginAuthentication={postLoginAuthentication} />}
                <p>OR</p>
                {registration
                    ? <p className={ui.authenticationSelection} onClick={() => setRegistration(false)}>Login</p>
                    : <p className={ui.authenticationSelection} onClick={() => setRegistration(true)}>Create new company</p>}
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        authentification: state.authentification
    }
}

export const AuthentificationComposer = compose(connect(mapStateToProps, {postLoginAuthentication, createNewCompany}))(Authentification)
