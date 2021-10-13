import React, {useState} from 'react'
import { FiSearch } from "react-icons/fi";

function Searchbar() {
    const [searchInput, setSearchInput] = useState('asdasd')
    return (
        <div className='searchbar'>
            <input type="text" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} />
            <button><FiSearch/></button>
        </div>
    )
}

export default Searchbar
