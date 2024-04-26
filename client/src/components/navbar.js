import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import "./navbar.css";
import { navItems } from './navitems';
import Button from "./button";
import dropdown from './dropdown';

function navbar() {
  const [dropdown, setDropdown] = useState(false);
  return (
    <>
      <nav className="navbar">
        <Link to="/Dashboard" className="dashboard">Dashboard</Link>
        <ul className="nav-items">
          {navItems.map(item => {
            if(item,title === "Collections"){
              return (
                <li key={item.id} className={item.cName} onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
                  <Link to={item.path}>{item.title}</Link>
                    {dropdown && <Dropdown />}
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
      <Dropdown />
    </>
  )
}

export default navbar
