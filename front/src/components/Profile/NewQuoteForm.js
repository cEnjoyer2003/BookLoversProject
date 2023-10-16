import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useState } from 'react';
import Header from '../Header';
import { submitItem, expanderClick, showNote } from '../../functions';
import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import AuthContext from '../../context/AuthProvider';

export default function NewQuoteForm({ username, quote }) {
  const {setData} = useContext(AuthContext);
  const text = quote ? quote.quoteText : null;
  const [expanded, setExpanded] = useState(true);
  const [quoteText, setQuoteText] = useState(quote ? quote.quoteText : null);
  const [author, setAuthor] = useState(quote ? quote.author : null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = !quote ? await submitItem({
      username,
      quoteText,
      author,
    }, 'new-quote') : await submitItem({
      username,
      quoteText,
      author,
      text
    }, 'edit-quote');
    console.log(response.status)
    if (response.status === 200 && !quote) {
      document.getElementById("quote-text").value = "";
      document.getElementById("quote-author").value = "";
      setData((prev) => ({ ...prev, edit: response }));
    } else if (response.status === 200 && quote) {
      setData((prev) => ({ ...prev, edit: null }));
      navigate(`/my-quotes`);
    } else if (response.status === 400) {
      showNote(document.getElementById("quote-text"), "bottom-out", "You already have quote with this text");
      return;
    } else {
      alert("error occurred");
    }
  }
  const quoteStyle = quote && { width: "60%", margin: "5rem auto" };
  return (
    <div>
      {quote && <Header />}
      <div style={quoteStyle} className="form-container">
        <button className="form-expander" onClick={e => { expanderClick(expanded, setExpanded, "quote-form") }}>
          <FontAwesomeIcon icon={expanded ? faCompress : faExpand} />
        </button>
        <h2 className="form-header">{quote ? "Edit" : "New"} quote</h2>
        <form className="new-item-form" onSubmit={handleSubmit} id="quote-form">
          <label className='form-label' id="text-label">Quote</label>
          <textarea defaultValue={quote ? quote.quoteText : ""} 
              id="quote-text" onChange={e => setQuoteText(e.target.value)} 
              placeholder="Quote..." 
              required />
          <label className='form-label' id="author-label">Author</label>
          <input defaultValue={quote ? quote.author : ""} 
              onChange={e => setAuthor(e.target.value)} 
              id="quote-author" type="text"
              placeholder="Enter quote author" 
              required />
          {!quote && <input className='button form-submit' type="submit" value='Add new quote' />}
          {quote && <div className='save-submit'>
            <input className='button save-changes' type="submit" value={'Save changes'} />
            <Link to={`/my-quotes`}>
              <button className='button cancel-button'>Cancel</button>
            </Link>
          </div>}
        </form>
      </div>
    </div>)
}

NewQuoteForm.propTypes = {
  username: PropTypes.string.isRequired,
};