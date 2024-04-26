import React from 'react';
import {Link} from 'react-router-dom';
import "./button.css"

function button() {
  return (
    <div>
      <Link to="sign-in">
        <button className="btn">Sign In</button>
      </Link>
    </div>
  )
}

export default button
