import React, {useState} from 'react'
import { collectionsDropdown } from './navitems';
import { Link } from 'react-router-dom';
import "./dropdown.css";

function Dropdown() {
    const [inventoryDropdown, setInvDropdown] = useState(false);

  return (
    <>
        <ul className={inventoryDropdown ? "inventorySubmenu clicked" : "inventorySubmenu"} onClick={() => setInvDropdown(!inventoryDropdown)}>
            {inventoryDropdown.map(item => {
                return (
                    <li key={item.id}>
                        <Link to={item.path} className={item.cName} onClick={() => setInvDropdown(false)}>{item.title} </Link>
                    </li>
                )
            })}
        </ul>
    </>
  )
}

export default Dropdown
