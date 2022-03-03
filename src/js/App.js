import Home from "./Home";
import React, {useEffect} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {AuthentificationComposer} from "./features/authentification/scene/Authentification";
import ui from './ui.module.css'
import {setLocalStorageInfo} from "./features/authentification/core/authentificationReducer";


const App = ({authentification}) => {

    return (
        <div className={ui.commonBox}>
            {authentification.authenticationStatus ? <Home /> : <AuthentificationComposer />}
        </div>
    )
}



const mapStateToProps = (state) => {
    return {
        authentification: state.authentification
    }
}

export const AppComposer = compose(connect(mapStateToProps, {setLocalStorageInfo}))(App)
