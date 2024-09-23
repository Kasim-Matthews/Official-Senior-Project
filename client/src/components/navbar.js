<<<<<<< HEAD
import React from 'react';
import {Link} from 'react-router-dom';

function navbar() {
  return (
    <div className="navbar">
      <div className="navContent">
        <Link to="./pages/purchase">Purchase</Link>
        <Link to="./pages/vendor"> Add Vendor</Link>
        <Link to="./pages/product">Add Product</Link>
        <Link to="./pages/fair-market-value">Fair Market Value</Link>
       
      </div>
    </div>
  )
}

export default navbar
=======
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import "./navbar.css";
import { navItems } from './navitems';
import Button from "./button";
import Dropdown from './dropdown';
import InventoryDropdown from './inventoryDropdown';
import PartnerDropdown from './partnerDropdown';

function Navbar() {
  const [dropdown, setDropdown] = useState(false);
  const [invDropdown, setInvDropdown] = useState(false);
  const [parDropdown, setParDropdown] = useState(false);
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
                    {invDropdown && <InventoryDropdown />}
                </li>
              );
            }
            if(item.title === "Partners"){
              return (
                <li key={item.id} className={item.cName} onMouseEnter={() => setParDropdown(true)} onMouseLeave={() => setParDropdown(false)}>
                  <Link to={item.path}>{item.title}</Link>
                    {parDropdown && <PartnerDropdown />}
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
>>>>>>> presentation
