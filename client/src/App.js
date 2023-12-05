import React, { useState } from "react";
import Axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';

function App() {
  // Existing state declarations
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState("");


  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const register = () => {
    Axios.post('http://localhost:3001/register', {
      username: usernameReg, 
      password: passwordReg,
    }).then((response) => {

    })
  };

  const login = () => {
    Axios.post('http://localhost:3001/login', {
      username: username, 
      password: password,
    }).then((response) => {
      if(response.data.status === 'ok') {
        setIsLoggedIn(true); // Set the isLoggedIn state to true on successful login
      } else {
        setLoginStatus(response.data.message);
      }
    });
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn ? <Navigate to="/Dashboard" /> : (
          <div>
      <div className="registration">
        <h1>Registration</h1>
        <label>Username</label>
        <input 
          type="text" 
          onChange={(e) => {
            setUsernameReg(e.target.value);
          }}
        />
        <label>Password</label>
        <input type="text" 
          onChange={(e) => {
            setPasswordReg(e.target.value);
           }}
        />
        <button onClick={register}> Register </button>
      </div>

            <div className="login">
        <h1>Login</h1>
        <input type="text" placeholder="Username..." 
          onChange={(e) => {
          setUsername(e.target.value);
         }} 
        />
        <input type="password" placeholder="Password..." 
          onChange={(e) => {
          setPassword(e.target.value);
         }} 
        />
        <button onClick={login}> Login </button>
      </div>

      <h1>{loginStatus}</h1>
    </div>
        )}

        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;