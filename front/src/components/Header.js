import React, { useContext } from 'react';
import logo from '../logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link  } from "react-router-dom";
import AuthContext from '../context/AuthProvider';

function Header() {
  const {setData} = useContext(AuthContext);
    return (
      <header id="header">
        <div className='logo-container'>
          <img id="header-icon" className='logo-img' alt="logo" src={logo} />
          <h1 className='logo-h1'>BookLovers</h1>
        </div>
        <div id='header-menu'>
          <Link to="/my-profile" className="header-menu-link"><FontAwesomeIcon icon={faUser} /> My profile</Link>
          <Link to="/main-page" className="header-menu-link"><FontAwesomeIcon icon={faHouse} /> Main page</Link>
          <Link to="/sign-in"  
            onClick={e => {
              if(!window.confirm('Do you want to sign out?')) 
                e.preventDefault();
              else
                setData({});
              }}
            className="header-menu-link">
              <FontAwesomeIcon icon={faRightFromBracket} /> Sign out
          </Link>
        </div>
      </header>
    );
}

export default Header;