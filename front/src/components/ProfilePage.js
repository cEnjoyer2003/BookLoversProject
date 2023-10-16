import React, {useContext} from 'react';
import { rangs } from '../constants';
import { submitItem } from '../functions';
import Header from './Header';
import Profile from './Profile/Profile';
import Board from './Profile/Board';
import NewReviewForm from './Profile/NewReviewForm';
import NewTopForm from './Profile/NewTopForm';
import NewQuoteForm from './Profile/NewQuoteForm';
import AuthContext from '../context/AuthProvider';

function autoResize() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
}

export default function ProfilePage({ edit, remove }) {
  const {data} = useContext(AuthContext);
  const user =  edit ? data.user : data.userView.user;
  const quotes = edit ? data.quotes || [] : data.userView.quotes || [];
  const reviews = edit ? data.reviews || [] : data.userView.reviews || [];
  const tops = edit ? data.tops || [] : data.userView.tops || [];
  
  let username = user.username;
  let rang;
  switch (true) {
    case (quotes.length > tops.length && quotes.length > reviews.length):
      rang = rangs[0];
      break;
    case (quotes.length === tops.length && quotes.length === reviews.length && quotes.length > 3):
      rang = rangs[1];
      break;
    case (reviews.length > tops.length && reviews.length > quotes.length):
      rang = rangs[2];
      break;
    case (quotes.length === 0 && tops.length === 0 && reviews.length === 0):
      rang = rangs[3];
      break;
    case (tops.length > reviews.length && tops.length > quotes.length):
      rang = rangs[4];
      break;
    default:
      rang = rangs[3];
      break;

  }
  [...document.querySelectorAll("textarea")].map(textarea => textarea.addEventListener('input', autoResize, false));
  const gridStyle = {gridTemplateColumns: edit ? "1fr 2fr 1fr" : "1fr 1fr"}

  async function deleteMessages(e) {
    document.getElementById("messages-dialog").close();
    const response = await submitItem({username}, "delete-messages");
    if(response.status !== 200) console.log("error deleting messages");
  }
  return (
    <div>
      <Header />
      { edit && user.messages?.length && <dialog open id="messages-dialog">
        {user.messages.split(";").map(msg => (<p key={msg}>{msg}</p>))}
        <button className='button' onClick={deleteMessages}>Ok</button>
      </dialog>}
      <div id='ProfilePage' style={gridStyle}>
        <div id="left-column">
          <Profile rang={rang} my={edit} remove={remove}/>
          <Board edit={edit} remove={edit} username={username} content={edit ? "My tops" : "Tops"} items={tops.length > 3 ? tops.slice(0, 3) : tops} />
        </div>
        {edit && <div id='middle-column'>
          <NewReviewForm username={username} />
          <NewTopForm username={username} />
          <NewQuoteForm username={username} />
        </div>}
        <div id='right-column'>
          <Board edit={edit} remove={edit} username={username} content={edit ? "My reviews" : "Reviews"} items={reviews.length > 3 ? reviews.slice(0, 3) : reviews} />
          <Board edit={edit} remove={edit} username={username} content={edit ? "My quotes" : "Quotes"} items={quotes.length > 3 ? quotes.slice(0, 3) : quotes} />
        </div>
      </div>
    </div>
  );
}