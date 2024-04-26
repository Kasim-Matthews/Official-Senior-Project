import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import "./navbar.css";
import { navItems } from './navitems';
import Button from "./button";
import Dropdown from './dropdown';

function Navbar() {
  const [dropdown, setDropdown] = useState(false);
  const [inventoryDropdown, setInvDropdown] = useState(false);
  return (
    <>
      <nav className="navbar">
        <ul className="nav-items">
          {navItems.map(item => {
            if(item.title === "Collections"){
              return (
                <li key={item.id} className={item.cName} onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
                  <Link to={item.path}>{item.title}</Link>
                    {dropdown && <Dropdown />}
                </li>
              );
            }
            if(item.title === "Inventory"){
              return (
                <li key={item.id} className={item.cName} onMouseEnter={() => setInvDropdown(true)} onMouseLeave={() => setInvDropdown(false)}>
                  <Link to={item.path}>{item.title}</Link>
                    {inventoryDropdown && <Dropdown />}
                </li>
              );
            }
            return (
            <li key={item.id} className={item.cName}>
              <Link to={item.path}>{item.title}</Link>
            </li>
            );
          })}
        </ul>
        <Button />
      </nav>
    </>
  )
}

export default Navbar
