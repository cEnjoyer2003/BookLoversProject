import {showNote} from '../functions';

export default function FilterForm({setFilter}) {
    function applyFilter() {
        let from = document.getElementById("filter-from");
        let to = document.getElementById("filter-to");
        if(to.value < from.value) {
            showNote(to, "top-out", "To must be greater than from");
            return;
        }
        setFilter({from: from.value, to: to.value});
    }
    return (
        <div id="filter-form" className="form-container">
            <h2 className="form-header">Set rating</h2>
            <label className='form-label'>From:</label>
            <input id="filter-from" type="number" min="1" max="5" placeholder="From" defaultValue={0} />
            <label className='form-label'>To:</label>
            <input id="filter-to" type="number" min="1" max="5" placeholder="To" defaultValue={0}/>
            <div id="filter-button-div">
                <button className="button" onClick={applyFilter}>Apply</button>
                <button className="button cancel-button" onClick={e => setFilter({from:0, to:5})}>Cancel</button>
            </div>
        </div>
    )
}