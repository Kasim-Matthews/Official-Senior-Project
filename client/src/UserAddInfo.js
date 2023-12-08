import React, { useState } from 'react';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';

function UserAddInfo({ userId }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement the API call to update the user info in the database
    try {
      await Axios.post('http://localhost:3001/updateUserInfo', {
        userId: userId,
        name: name,
        role: role
      });
      setIsSubmitted(true); // Set isSubmitted to true to redirect to Dashboard
    } catch (error) {
      console.error("Error updating user info:", error);
      // Handle error
    }
  };

  if (isSubmitted) {
    return <Navigate to="/Dashboard" />;
  }

  return (
    <div>
      <h1>Welcome, user {userId}, please finish setting up your account.</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UserAddInfo;
