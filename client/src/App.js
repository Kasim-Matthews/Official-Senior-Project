


/*import React, { useState } from "react";
import Axios from 'axios';
import './Login.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserAddInfo from './UserAddInfo';

function App() {
  // Existing state declarations
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState("");
  const [additionalInfoRequired, setAdditionalInfoRequired] = useState(false);
  const [userId, setUserId] = useState(null);


  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const register = () => {
    Axios.post('http://localhost:3306/register', {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {

    })
  }

  const login = () => {
    Axios.post('http://localhost:3306/login', {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.status === 'ok') {
        setIsLoggedIn(true); // Set the isLoggedIn state to true on successful login
      } else if (response.data.status === 'additional_info_required') {
        setAdditionalInfoRequired(true);
        setLoginStatus(response.data.message);
        setUserId(response.data.userId);
        console.log(response.data.userId)
      } else {
        setLoginStatus(response.data.message);
      }
    });
  };

  return (

    <div className="App">
      <header className="App-header">
        <h1>Diaper Bank of Northeast Florida Inventory Management System</h1>
      </header>
      
      {isLoggedIn && !additionalInfoRequired ? <Navigate to="/Dashboard" /> : null}
      {additionalInfoRequired ? <UserAddInfo userId={userId} /> : null}
      <div>
      <div className="form-container">
        <div className="register">
          <h1>Registration</h1>
          <label>Email</label>
          <input
            type="text" placeholder="Email..."
            onChange={(e) => {
              setUsernameReg(e.target.value);
            }}
          />
          <label>Password</label>
          <input type="text" placeholder="Password..."
            onChange={(e) => {
              setPasswordReg(e.target.value);
            }}
          />
          <button onClick={register}> Register </button>
        </div>

        <div className="login">
          <h1>Login</h1>
          <label>Email</label>
          <input type="text" placeholder="Email..."
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <label>Password</label>
          <input type="password" placeholder="Password..."
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button onClick={login}> Login </button>
        </div>

        <h1>{loginStatus}</h1>
      </div>


    </div>
    </div>
  );
}


export default App;*/