import React, {useState} from 'react'
import { collectionsDropdown } from './navitems';
import { Link } from 'react-router-dom';
import "./dropdown.css";

function dropdown() {
    const [dropdown, setDtopdown] = useState(false);

  return (
    <>
        <ul className={dropdown ? "collectionsSubmenu clicked" : "collectionsSubmenu"} onClick={() => setDropdown(!dropdown)}>
            {collectionsDropdown.map(item => {
                return (
                    <li key={item.id}>
                        <Link to={item.path} className={item.cName}>{item.title} onClick={() => setDropdown(false)}</Link>
                    </li>
                )
            })}
        </ul>
    </>
  )
}

export default dropdown
