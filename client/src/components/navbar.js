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
