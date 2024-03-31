import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [emailReg, setEmail] = useState('');
  const [passwordReg, setPassword] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');
  const navigate = useNavigate();

  const register = () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;


    // Check if email or password fields are blank
    if (!emailReg.trim() || !passwordReg.trim()) {
        setRegistrationStatus("Email and password cannot be blank.");
        return; // Exit the function to prevent the Axios call
      }

        // Check email format
    if (!emailRegex.test(emailReg)) {
        setRegistrationStatus("Please enter a valid email address.");
        return;
    }

    // Check password constraints
    if (!passwordRegex.test(passwordReg)) {
        setRegistrationStatus("Password must be 6-12 characters long, include a number and a special character.");
        return;
    }

    Axios.post('http://localhost:3306/register', {
      email: emailReg,
      password: passwordReg,
    }).then((response) => {
      if (response.data.success) {
        navigate("/login"); // Redirect to login after successful registration
        setRegistrationStatus("Registration successful. Please login.");

      } else {
        // Handle registration error message here
        setRegistrationStatus(response.data.message);
      }
    });
  };

  return (
    <div className="register-container">
      <h1>Registration</h1>
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
      <button onClick={register}>Register</button>
      {registrationStatus && <h1>{registrationStatus}</h1>}
      <Link to="/login">Already have an account? Login here</Link>
    </div>
  );
};

export default Register;
