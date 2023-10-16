import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEdit, faUser, faBook, faPenNib, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import {React, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getItemType, submitItem } from '../functions';
import AuthContext from '../context/AuthProvider';


function SwitchComponentCompressed({itemType, item, userLinkClick}) {
  const {setData} = useContext(AuthContext);

  switch (itemType) {
    case "review":
      return (
        <>
          <h2 className="item-header">{item.title}</h2>
          <p className='item-authors'>{`- ${item.author}`}</p> {/*style={{textAlign: expand ? "left" : "right"}}*/}
          <span>{
            Array.apply(null, { length: item.rank }).map((e, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className='gold-star' />
            ))
            }</span>
            <span>{
            Array.apply(null, { length: 5-item.rank }).map((e, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className='gray-star' />
            ))
            }</span>
            <p className='item-authors'><FontAwesomeIcon icon={faUser} /> {item.username}</p>
        </>
      );
    case "top":
      return (
        <>
          <h2 className="item-header">{item.title}</h2>
          <p className='item-authors'><FontAwesomeIcon icon={faUser} /> {item.username}</p>

        </>
      );
    case "quote":
      return (
        <>
          <p className='item-text'>{item.quoteText}</p>
          <p className='item-authors'>{`- ${item.author}`}</p> {/*style={{textAlign: expand ? "left" : "right"}}*/}
          <p className='item-authors'><FontAwesomeIcon icon={faUser} /> {item.username}</p>

        </>
      );
    case "user":
      return (
        <a onClick={e => {e.preventDefault(); userLinkClick(item.username, setData)}}>
          <p className='item-authors'><FontAwesomeIcon icon={faUser} /> {item.username}</p>
        </a>
      );
    case "title":
      return (
        <h2 className="item-header">{item.title}</h2>
      );
    case "book":
      return (
        <>
          <h3 className='item-header'><FontAwesomeIcon icon={faBook} /> {item.title}</h3>
          <p className='item-authors'><FontAwesomeIcon icon={faPenNib} /> {item.author}</p>
          <p className='item-authors'>Genres: {item.genres.split(',').join(', ')}</p>
        </>
      );
    default:
      return null;
  }
}

function SwitchComponentExpanded({itemType, item}) {
  const {setData} = useContext(AuthContext);

  switch(itemType) {
    case "review":
      return(
        <>
            <p className="Profile-p-genres">Genres:</p> 
            {item.genresString.split(',').map(genre => (<p key={genre} className='Profile-genre'>{genre}</p>))}
            <p className="Profile-p-genres">Review:</p>
            <p className='Profile-text'>{item.reviewText}</p>
        </>
      );
    case "top":
      return(
        <>
        <p className='form-label'>Genre: {item.genre}</p>
        <div className="books">
          {item.books.map(book => (<Item key={book.title} item={book} setData={setData}/>))}
        </div>
        </>
      );
      default:
        return null;
  }
}

function Buttons({itemType, item, expanded, setExpanded, editable, expand}) {
  const {setData} = useContext(AuthContext);

  if(editable && expand) {
    switch(itemType) {
      case "quote":
        return(
          <div className="quote-body">
            <Link to={"/edit-" + itemType}>
              <button onClick={e => {setData((prev)=>({...prev, edit: item}))}} className="edit-item-button">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </Link>
          </div>
        );
      case "top":
      case "review":
        return(
          <div className="top-review-body">
            <button onClick={e => {setExpanded(!expanded)}} className="Board-expander">
              <FontAwesomeIcon icon={faAngleDown} flip={expanded ? "vertical" : false}  />
            </button>
            <Link to={"/edit-" + itemType}>
              <button onClick={e => {setData((prev)=>({...prev, edit: item}))}} className="edit-item-button">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </Link>
          </div>
        );
      default: 
        return null;
    }
  } else if (!editable && expand) {
    switch(itemType) {
      case "top":
      case "review":
        return (
        <button onClick={e => {setExpanded(!expanded)}} className="Board-expander">
          <FontAwesomeIcon icon={faAngleDown} flip={expanded ? "vertical" : false} />
        </button>
        );
      default: 
        return null;
    }
  } else {
    return null;
  }
}

function Item({item, editable, expand}) {
  const {data} = useContext(AuthContext);
  const itemType = getItemType(item);

  const [expanded, setExpanded] = useState();

  const navigate = useNavigate();

async function userLinkClick(username, setData) {
  const response = await submitItem({
    username
  }, 'get-user');
  if(response.status===404){
    alert("no such user");
  } else if(response.status === 200) {
    setData((prev) => ({...prev, userView: response}));
    navigate(data.roles.includes("admin") ? `/${username}` : `/${username}-view`);
  } else {
    alert("error occurred");
  }
}

      return (
        <div className="item">
          <div className='item-body'>
            <SwitchComponentCompressed itemType={itemType} item={item} userLinkClick={userLinkClick}/>
            {expanded && <SwitchComponentExpanded itemType={itemType} item={item} userLinkClick={userLinkClick}/>}
          </div>
            <Buttons itemType={itemType} item={item} expanded={expanded} setExpanded={setExpanded} editable={editable} expand={expand} />
          </div>
      );
    }
  
    Item.propTypes = {
      item: PropTypes.object.isRequired,
    };

  export default Item;