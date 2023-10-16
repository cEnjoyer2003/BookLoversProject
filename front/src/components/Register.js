import React, { useState, useContext } from 'react';
import Select from 'react-select';
import logo from '../logo.png';
import { genres, avatars, usernamePattern } from '../constants';
import { submitItem, inputChecked, showNote } from '../functions';
import { Link, useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthProvider';
import Password from './Password';

const styles = {
  control: (base, state) => ({
    ...base,
    border: state.isFocused ? '2px solid #613A43' : '1px solid #073215',
    boxShadow: 'none',
    '&:hover': {
      border: state.isFocused ? '2px solid #613A43' : '1px solid #073215'
    }
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? isSelected ? '#88676e' : '#b29da2' : 'white'
  })
};

export default function Register() {
  const {data, setData} = useContext(AuthContext);
  const user = data.user;
  const plainPassword = data.plainTextPassword;

  const oldUsername = user ? user.username : null;
  const initGenres = user ? user.genresString.split(',') : [];

  const [avatar, setAvatar] = useState(user ? user.avatar : null);
  const [username, setUserName] = useState(user ? user.username : null);
  const [email, setEmail] = useState(user ? user.email : null);
  const [password, setPassword] = useState(plainPassword ? plainPassword : null);
  const [confPassword, setConfPassword] = useState(plainPassword ? plainPassword : null);
  const [name, setName] = useState(user ? user.name : null);
  const [surname, setSurname] = useState(user ? user.surname : null);
  const [userGenres, setUserGenres] = useState(initGenres);
  const [about, setAbout] = useState(user ? user.about : null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (userGenres.length === 0) { alert("choose at least one favourite genre"); return; }
    if (password !== confPassword) { 
      let confpwd = document.getElementById('password-input');
      showNote(confpwd, 'top-out', "passwords must be the same")
      return; 
    }
    let genresString = [...userGenres].join(',');
    const response = user ? await submitItem({
      avatar,
      username,
      email,
      password,
      name,
      surname,
      genresString,
      about,
      oldUsername
    }, 'edit') : await submitItem({
      avatar,
      username,
      email,
      password,
      name,
      surname,
      genresString,
      about
    }, 'register');
    console.log(response);
    if (response.status === 200) {
      setData((prev) => ({ ...prev, user: response.user, plainTextPassword: password, roles: [response.user.role] }));
      console.log("registered")
      navigate("/my-profile");
    } else if (response.status === 400) {
      showNote(document.getElementById("login"), "bottom-out", "This username is taken");
      return;
    } else if (response.status === 401) {
      showNote(document.getElementById("login"), "bottom-out", "There already exists an account for this email");
      return;
    } else {
      alert('error occurred')
    }
  }

  const registerButtonStyle = user ? 
    { width: "8rem", float: "left", margin: "0", paddingLeft: "10px" } : 
    { float: "left", margin: "0" };
    
  return (
    <div id="register-form">
      <div id="register-logo" className='logo-container'>
        <img className="logo-img" src={logo} alt="logo" />
        <h1 className='logo-h1'>BookLovers</h1>
      </div>
      <div className="form-container">
        <h2 className="form-header">My profile</h2>
        <form onSubmit={handleSubmit} id="review-form" className="new-item-form">
          <div id="register-avatar">
            <label className='form-label'>Choose your avatar</label>
            <div id="select-container">
              <Select defaultValue={user ? avatars.find(avatar => avatar.value === user.avatar) : ""} required id="select"
               onChange={e => setAvatar(e.value)} name="Choose your avatar" styles={styles}
              options={avatars} /> 
            </div>
          </div>
          <label className='form-label' id="login-label">Login</label>
          <input pattern={usernamePattern} onChange={e => setUserName(e.target.value)} id="login" type="text" 
            placeholder="Enter login" required defaultValue={user ? user.username : ""} />
          <label className='form-label' id="login-label">Email</label>
          <input onChange={e => setEmail(e.target.value)} id="email" type="email" 
            placeholder="Enter email" required defaultValue={user ? user.email : ""} />
          <label className='form-label' id="password-label">Password</label>
          <Password id="password-input" setPassword={setPassword} plainPassword={plainPassword} user={user} />

          <label className='form-label' id="password-label">Confirm password</label>
          <Password id="conf-password-input" setPassword={setConfPassword} plainPassword={plainPassword} user={user} />

          <label className='form-label' id="name-label">Name</label>
          <input onChange={e => setName(e.target.value)} id="title" type="text" placeholder="Enter name" required defaultValue={user ? user.name : ""} />
          <label className='form-label' id="surname-label">Surname</label>
          <input onChange={e => setSurname(e.target.value)} id="author" type="text" placeholder="Enter surname" required defaultValue={user ? user.surname : ""} />
          <label className='form-label'>Favourite genre(s)</label>
          <div className='form-genres'>
            <div>
              {genres.slice(0, Math.ceil(genres.length / 2)).map(genre => (
                <label key={"register-" + genre}>
                  <input defaultChecked={user ? user.genresString.split(',').includes(genre) : false} 
                  onClick={e => inputChecked(e, userGenres, setUserGenres)} 
                  key={genre} value={genre} type="checkbox" />

                   {genre}
                </label>))}
            </div>
            <div>
              {genres.slice(Math.ceil(genres.length / 2), genres.length).map(genre => (
                <label key={"register-" + genre}>
                  <input defaultChecked={user ? user.genresString.split(',').includes(genre) : false} 
                  onClick={e => inputChecked(e, userGenres, setUserGenres)} 
                  key={genre} value={genre} type="checkbox" />
                  
                   {genre}
                </label>))}
            </div>
          </div>
          <label className='form-label' id="text-label">About me</label>
          <textarea onChange={e => setAbout(e.target.value)} placeholder="About me..." required defaultValue={user ? user.about : ""} />
          <div id="register-buttons">
            <input style={registerButtonStyle} id="register-button" className='button' type="submit" value={user ? 'Save changes' : 'Register'} />
            <Link to={user ? "/my-profile" : "/sign-in"}>
              <button className='button cancel-button'>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
