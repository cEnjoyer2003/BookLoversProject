import {React, useContext} from 'react';
import Item from '../Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header';
import {submitItem, getItemType} from '../../functions';
import { Link } from "react-router-dom";
import AuthContext from '../../context/AuthProvider';

export default function Board({ content, items, username, expand, remove, edit }) {
    const { data, setData } = useContext(AuthContext)

    const removeItem = async (e) => {
        if(remove && edit) {
            if (!window.confirm("Do you want to delete the item?"))
            return;
        } else if (remove && !edit) {
            if(!document.getElementById("message").value){
                alert("reason is required");
                return;
            }
        }
        let message = remove && !edit ? document.getElementById("message").value : "";
        const item = JSON.parse(e.target.closest('button').value);
        const itemType = getItemType(item);
        switch (itemType) {
            case "review":
                const reviewResponse = await submitItem({
                    username,
                    reviewTitle: item.title,
                    message
                }, 'delete-review');
                console.log(reviewResponse);
                if (reviewResponse.status === 200) {
                    const index = items.findIndex(i => {
                        return i.title === item.title;
                      });
                    items.splice(index, 1);
                    setData((prev) => ({ ...prev, edit: item }));
                }
                else if (reviewResponse.status === 404)
                    alert("no such review");
                else
                    alert('error occurred');
                break;
            case "top":
                const topResponse = await submitItem({
                    username,
                    topTitle: item.title,
                    message
                }, 'delete-top');
                if (topResponse.status === 200) {
                    const index = items.findIndex(i => {
                        return i.title === item.title;
                      });
                    items.splice(index, 1);
                    setData((prev) => ({ ...prev, edit: item }));
                }
                else if (topResponse.status === 404)
                    alert("no such top");
                else
                    alert('error occurred');
                break;
            case "quote":
                const quoteResponse = await submitItem({
                    username,
                    quoteText: item.quoteText,
                    message
                }, 'delete-quote');
                console.log(quoteResponse);
                if (quoteResponse.status === 200) {
                    const index = items.findIndex(i => {
                        return i.quoteText === item.quoteText;
                      });
                    items.splice(index, 1);
                    setData((prev) => ({ ...prev, edit: item }));
                }
                else if (quoteResponse.status === 404)
                    alert("no such quote");
                else
                    alert('error occurred');
                break;
            default:
                break;
        }
        document.getElementById("remove-item-dialog").close();
    }
    let boardStyle = expand && { width: "60%", margin: "5rem auto" };
    let linkTo;
    if(remove && edit) {
        linkTo = expand ? "/my-profile" : `/my-${content.split(' ')[1]}`;
    } else {
        if(data.roles.includes("valid-user"))
            linkTo = expand ? `/${username}-view` : `/${username}-${content.toLowerCase()}-view`;
        else
            linkTo = expand ? `/${username}` : `/${username}-${content.toLowerCase()}`;
    }
    return (
        <div>
            {expand && <Header />}
            <div style={boardStyle} className="Board">
                <Link to={linkTo}>
                    <button className="Board-expander">
                        <FontAwesomeIcon icon={expand ? faArrowLeft : faArrowRight} />
                        {expand ? " Profile" : ""}
                    </button>
                </Link>
                <h2 className="Board-header">{content}</h2>
                <div className="Board-content">
                    {items && !expand && [...items].map(item => (
                        <Item expand={expand} key={item.quoteText ? item.quoteText : item.title}
                        editable={expand && edit} item={item} />))}

                    {items && expand && [...items].map(item => (
                        <div className="flex-center" key={item.quoteText ? item.quoteText : item.title} >
                            <Item expand={expand} editable={expand && edit} item={item} />
                            {remove && edit && <button value={JSON.stringify(item)} onClick={removeItem} className="remove-book">
                                <FontAwesomeIcon icon={faClose} />
                            </button>}
                            {remove && !edit && 
                            <button onClick={e => document.getElementById("remove-item-dialog").showModal()} className="remove-book">
                                <FontAwesomeIcon icon={faClose} />
                            </button>}
                            <dialog id="remove-item-dialog">
                                <p className='form-label'>Are you sure you want to delete this item?</p>
                                <p className='form-label'>This action cannot be reversed.</p>
                                <p className='form-label'>Write the reason for removing this item, it will be displayed to user:</p>
                                <input id="message" type="text" placeholder='Your reason...' />
                                <div id="userform-btns">
                                    <button className='button' value={JSON.stringify(item)} onClick={removeItem}>Delete <FontAwesomeIcon icon={faTrash} /></button>
                                    <button className='button' onClick={e=>{document.getElementById("remove-item-dialog").close();}}>Cancel</button>
                                </div>
                            </dialog>
                        </div>))}
                </div>
            </div>
        </div>
    );
}