import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import {submitItem, showNote} from '../functions';
import React from 'react';

export default function UserForm({user}){
    const {setData} = useContext(AuthContext);
    const navigate = useNavigate();
    async function editRole(e) {
        e.preventDefault();
        let select = document.getElementById("role-select");
        let role = select.options[select.selectedIndex].value;
        if(role === user.role) {
            return;
        }
        if(!window.confirm(`Are you sure you want to change ${user.username}'s role from ${user.role} to ${role}`)){
            return;
        }
        let message = `Your role has been changed from ${user.role} to ${role}`;
        const response = await submitItem({
            username: user.username,
            role,
            message
        }, 'edit-role');
        if (response.status === 200) {
            //setData((prev) => ({ ...prev, roles: [role] }));
            navigate(`/${user.username}`);
        } else if (response.status === 404) {
            showNote(document.getElementById("username"), "bottom-out", "No such user");
            return;
        } else {
            alert("error occurred");
            return;
        }
    }
    async function deleteUser(e) {
        e.preventDefault();
        let message = document.getElementById("message").value;
        if(!message) {
            showNote(document.getElementById("message"), "top-out", "Reason is required");
            return;
        }
        const response = await submitItem({
            username: user.username,
            message
        }, 'delete-user');
        if (response.status === 200) {
            setData((prev) => ({...prev, userView: {}}));
            navigate(`/main-page`);
        } else {
            alert("error occurred");
            return;
        }
    }
    function openDialog(){
        document.getElementById("delete-dialog").showModal();
    }
    return(
        <div id="user-form-container">
        <div id="user-form" className="form-container">
            <label className="form-label" id="username">Username: {user.username}</label>
            <label className="form-label">Number of reviews: {user.reviews? user.reviews.length:0}</label>
            <label className="form-label">Number of tops: {user.tops? user.tops.length:0}</label>
            <label className="form-label">Number of quotes: {user.quotes?user.quotes.length:0}</label>
            <label className='form-label' id="role-label">Role: {"\t"}</label>
            <select id="role-select">
                <option value="valid-user" selected={user.role==="valid-user"}>User</option>
                <option value="manager" selected={user.role==="manager"}>Manager</option>
                <option value="admin" selected={user.role==="admin"}>Admin</option>
            </select>
            <div id="userform-btns">
                <button className="button" onClick={editRole}>Edit <FontAwesomeIcon icon={faEdit} /></button>
                <button className="button" onClick={openDialog} id="open-delete-dialog">Delete user <FontAwesomeIcon icon={faTrash} /></button>
                
                <Link to={`/${user.username}`}>
                    <button className='button'>Cancel</button>
                </Link>
            </div>
            <dialog id="delete-dialog">
                    <p className='form-label'>Are you sure you want to delete this user?</p>
                    <p className='form-label'>This action cannot be reversed.</p>
                    <p className='form-label'>Write the reason for deleting this account, it will be displayed to user next time he(she) will try to sign in:</p>
                    <input id="message" type="text" placeholder='Your reason...' required />
                    <div id="userform-btns">
                    <button id="close-delete-dialog" className='button' onClick={deleteUser}>Delete <FontAwesomeIcon icon={faTrash} /></button>
                    <button className='button' onClick={e=>{document.getElementById("delete-dialog").close();}}>Cancel</button>
                    </div>
            </dialog>
        </div>
        </div>
    )
}