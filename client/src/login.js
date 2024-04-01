import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [emailLog, setEmail] = useState('');
  const [passwordLog, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  const login = () => {
    Axios.post('https://diaper-bank-inventory-management-system.onrender.com/login', {
      email: emailLog,
      password: passwordLog,
    }).then((response) => {
      if (response.data.success) {
        navigate("/dashboard"); // Redirect to dashboard on successful login
      } else {
        console.log(response.data.message)
        //setLoginStatus(response.data.message);
      }
    }).catch((error) => {
      const message = error.response && error.response.data.message ? error.response.data.message : "An error occurred";
      setLoginStatus(message);
    });

  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password..."
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      {loginStatus && <h1>{loginStatus}</h1>}
      <Link to="/register">Haven't made an account? Register here</Link>
    </div>
  );
};

export default Login;
