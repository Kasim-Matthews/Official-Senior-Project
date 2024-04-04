import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Login = () => {
  const [emailLog, setEmail] = useState('');
  const [passwordLog, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  const login = () => {
    Axios.post('http://localhost:3001/login', {
      email: emailLog,
      password: passwordLog,
    }).then((response) => {
      if (response.data.success) {
        navigate("/dashboard"); // Redirect to dashboard on successful login
      } else {
        setLoginStatus(response.data.message); 
      }
    }).catch((error) => {
        const message = error.response && error.response.data.message ? error.response.data.message : "An error occurred";
        setLoginStatus(message);
      });
  };

  return (
    <div className="login-container">
      <Card>
        <CardContent>
      <h1>Login</h1>
      <TextField id="email" label="Email" variant="outlined"
        type="text"
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <br></br><TextField id="Password" label="Password" variant="outlined"
        type="password"
        placeholder="Password..."
        onChange={(e) => setPassword(e.target.value)}
      />
      <br></br><Button onClick={login}>Login</Button>
      {loginStatus && <h1>{loginStatus}</h1>}
      <br></br><Link to="/register">Haven't made an account? Register here</Link>
      </CardContent>
      </Card>
    </div>
  );
};

export default Login;
