import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClose } from '@fortawesome/free-solid-svg-icons';
import {React, useContext, useState} from 'react';
import Header from './Header';
import Item from './Item';
import FilterForm from './FilterForm';
import { submitItem, getItemHeader } from '../functions';
import AuthContext from '../context/AuthProvider';

function MainPage() {
  const {setData} = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState({});
    function removeClick() {
      let input = document.getElementById("search-input");
      input.value="";
      setItems([]);
    }
    async function search(e) {
      if(e.key !== 'Enter') return;
      let request = e.target.value;
      if(request === "") return;
      let results = await submitItem({
        request,
        filter
      }, 'search');
      console.log(results);
      if(results.status === 404) {
        setItems([{title: " no results"}]);
        //this.setState({items: [{title: " no results"}]});
      } else if(results.status === 200) {
        //this.setState({items: results.items});
        setItems(results.items);
      } else {
        alert("error occurred");
      }
    }

    function sortItems() {
      let sortedItems = items.sort((a, b)=>{return getItemHeader(a).localeCompare(getItemHeader(b))})
      setItems([...sortedItems]);
    }
    let styleDisplay = {display: items.length ? "block" : "flex"};
      return(
        <div>
        <Header />
        <div id="search-container" style={styleDisplay} className='page-container'>
          <FilterForm setFilter={setFilter} />
          <div className="big-input" id='search-bar'>
            <FontAwesomeIcon id="search-icon" icon={faSearch}/>
            <input onKeyDown={search} id="search-input" onDoubleClick={e => e.target.select()} type='text' placeholder='Search a review/top...' />
            <button onClick={removeClick} id="remove-button">
              <FontAwesomeIcon id="remove-icon" icon={faClose} />
            </button>
          </div>
          <button id="sort-all" className="button" onClick={sortItems}>Sort all</button>
          <div id="search-results">
            {items && [...items].map(item => (<Item setData={setData} expand key={item.quoteText?item.quoteText:item.title ? item.title : item.username} item={item} />))}
          </div>
        </div>
        </div>
      );
}

export default MainPage;
