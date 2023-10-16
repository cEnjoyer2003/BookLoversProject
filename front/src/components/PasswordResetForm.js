import { submitItem, showNote } from "../functions"
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";


export default function PasswordResetForm() {
    const {setData} = useContext(AuthContext);
    const navigate = useNavigate();
    async function getCode(){
        let emailInput = document.getElementById("reset-pwd-email");
        let response = await submitItem({email: emailInput.value}, "send-reset-pwd-code");
        if(response.status === 404) {
            showNote(emailInput, "top-out", "no such user");
        } else if (response.status === 500) {
            alert("error occurred");
        }
    }
    async function confirmCode(){
        let emailInput = document.getElementById("reset-pwd-email");
        let codeInput = document.getElementById("reset-pwd-code");
        let response = await submitItem({email: emailInput.value, code: codeInput.value.toString()}, "confirm-reset-pwd-code");
        if(response.status === 404) {
            showNote(emailInput, "top-out", "wrong email");
        } else if(response.status === 400) {
            showNote(emailInput, "top-out", "wrong code");
        } else if(response.status === 200) {
            let newPwd = document.getElementById("new-password");
            let newPwdConf = document.getElementById("new-password-confirm");
            newPwd.disabled = false;
            newPwdConf.disabled = false;
            showNote(emailInput, "top-out", "enter code");
        } else if (response.status === 401) {
            showNote(emailInput, "top-out", "resend code");
        }
    }
    async function resetPassword(){
        let emailInput = document.getElementById("reset-pwd-email");
        let newPwd = document.getElementById("new-password");
        let response = await submitItem({email: emailInput.value, password: newPwd.value}, "reset-pwd");
        if(response.status === 200) {
            setData((prev) => ({...prev, user: response.user, roles: [response.user.role]}));
            navigate("/my-profile");
        } else {
            alert("error occurred");
        }
    }
    return (
        <div className='page-container'>
        <div className="form-container" id="reset-pwd-div">
                <Link to="/sign-in">
                    <button className="Board-expander">
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to sign in 
                    </button>
                </Link>
            <h2 className="form-header">Reset password</h2>
            <label className="form-label">Your email:</label>
            <input id="reset-pwd-email" type="email" placeholder="Email..." />
            <button className="button" onClick={getCode}>Get code</button>
            <label className="form-label">Code from email:</label>
            <input id="reset-pwd-code" type="text" placeholder="Code" />
            <button className="button" onClick={confirmCode}>Confirm code</button>
            <label className="form-label">New password:</label>
            <input id="new-password" type="password" placeholder="Password..." disabled/>
            <label className="form-label">Confirm new password:</label>
            <input  id="new-password-confirm" type="password" placeholder="Password" disabled/>
            <button className="button" onClick={resetPassword}>Reset password</button>
        </div>
        </div>
    )
}