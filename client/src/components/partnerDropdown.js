import React, {useState} from 'react';
import { partnerDropdown } from './navitems';
import { Link } from 'react-router-dom';
import "./partnerDropdown.css";

function PartnerDropdown() {
    const [parDropdown, setParDropdown] = useState(false);
  return (
    <div>
      <>
        <ul className={parDropdown ? "partnerSubmenu clicked" : "partnerSubmenu"} onClick={() => setParDropdown(!parDropdown)}>
            {partnerDropdown.map(item => {
                return (
                    <li key={item.id}>
                        <Link to={item.path} className={item.cName} onClick={() => setParDropdown(false)}>{item.title} </Link>
                    </li>
                )
            })}
        </ul>
    </>
    </div>
  )
}

export default PartnerDropdown
