import { passwordPattern } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Password({id, setPassword, user, plainPassword}) {
    return(
        <div id="div-password">
            <input 
              onFocus={e => { 
                e.target.closest('div').style.outline = "none"; 
                e.target.closest('div').style.border = "2px solid #613A43" }}

              onBlur={e => { 
                e.target.closest('div').style.outline = "none"; 
                e.target.closest('div').style.border = "1px solid #073215" }}

              onChange={e => {
                setPassword(e.target.value);
              }}

              className='password-input' id={id} type="password" placeholder='Enter password' required 
              defaultValue={user ? plainPassword : ""} pattern={passwordPattern} />
            
            <FontAwesomeIcon onClick={e => {
              document.getElementById(id).type = "text"; 
              setTimeout(() => {
                if (document.getElementById(id)) 
                  document.getElementById(id).type = "password";
              }, 3000);}}
             className="eye-icon-grey" icon={faEyeSlash} />
          </div>
    )
}