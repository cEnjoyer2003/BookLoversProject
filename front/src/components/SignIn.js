import React, {useState, useContext, useEffect} from 'react';
import logo from '../logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link  } from "react-router-dom";
import {submitItem, showNote} from '../functions';
import AuthContext from '../context/AuthProvider';

export default function SignIn() {
  const {setData} = useContext(AuthContext);
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState();
  const navigate = useNavigate();

  useEffect(()=>{
    setData({});
    localStorage.setItem("data", JSON.stringify({}));
  }, []);
  
  const handleSubmit = async e => {
    e.preventDefault();
    const response = await submitItem({
      username,
      password
    }, 'sign-in');
    if(response.status===200) {
      setData((prev) => ({...prev, ...response, plainTextPassword: password, roles: [response.user.role]}));
      navigate("/my-profile");
    } else if(response.status===400) {
      showNote(document.getElementById("password-div"), "bottom-out", "Invalid password");
      return;
    } else if(response.status===401) {
      setMessage(response.deleteMessage);
      document.getElementById("deleted-dialog").showModal();
      return;
    }else {
      showNote(document.getElementById("signin-login"), "bottom-out", "No such user");
      return;
    }
  }

  async function deleteUserData(e) {
    document.getElementById("deleted-dialog").close();
    const response = await submitItem({username}, "delete-userdata");
    if(response.status !== 200) console.log("error deleting user");
  }

  return(
    <div>
        <dialog id="deleted-dialog">
        <p className='form-label'>{message}</p>
        <button className='button' onClick={deleteUserData}>Ok</button>
      </dialog>
        <div className='page-container'>
          <div id="signin-form" className='form'>
          <div className='logo-container'>
            <img className="logo-img" src={logo} alt="logo" />
            <h1 className='logo-h1'>BookLovers</h1>
          </div>
          <form id="form-signin" onSubmit={handleSubmit} >
            <input onChange={e => setUserName(e.target.value)} className='big-input' id="signin-login" type="text" placeholder='Enter login or email' required/>
            <div id="password-div" className='big-input'>
              <input 
                    onFocus={e => {
                      e.target.closest('div').style.outline = "none";
                      e.target.closest('div').style.border = "2px solid #613A43"}}

                    onBlur={e => {
                      e.target.closest('div').style.outline = "none"; 
                      e.target.closest('div').style.border = "1px solid #613A43"}}

                    onChange={e => setPassword(e.target.value)} 
                    
                    className='password-input' id="signin-password" type="password" placeholder='Enter password' required/>

              <FontAwesomeIcon onClick={e => {
                document.getElementById('signin-password').type="text"; 
                setTimeout(() => {
                  if(document.getElementById('signin-password')) 
                    document.getElementById('signin-password').type="password";
                  }, 3000);}} 
                  
                className="eye-icon" icon={faEyeSlash} />
            </div>
            <input type="submit" id="signin-button" className="button" value="Sign in" />
            <p><Link to="/reset-pwd" id="register-link">Forgot password?</Link></p>
            <p><Link to="/register" id="register-link">No account yet? Register!</Link></p>
          </form>
          </div>
        </div>
        </div>
  )
}