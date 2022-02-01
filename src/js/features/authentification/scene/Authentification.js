import ui from '../ui.module.css'
import {BrowserRouter} from "react-router-dom";
import Login from "./Login";



const Authentification = () => {
    return (
        <BrowserRouter>
            <div className={ui.box}>
                <Login />
                <div>OR</div>
                <div>New here? Create an account</div>
            </div>
        </BrowserRouter>
    )
}
export default  Authentification
