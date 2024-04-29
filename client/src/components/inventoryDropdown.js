import React, {useState} from 'react'
import { inventoryDropdown } from './navitems';
import { Link } from 'react-router-dom';
import "./inventoryDropdown.css";

function InventoryDropdown() {
    const [invDropdown, setInvDropdown] = useState(false);

  return (
    <>
        <ul className={invDropdown ? "inventorySubmenu clicked" : "inventorySubmenu"} onClick={() => setInvDropdown(!invDropdown)}>
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

export default InventoryDropdown
