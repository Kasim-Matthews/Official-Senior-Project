// Home.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Home.css';


function Home() {
    return (
        <div className="home-container">
            <h1>Welcome to Diaper Bank of Northeast Florida</h1>
            <div className="main-body">
                <p>This is the main body section. You can add more details about your organization here, such as your mission, upcoming events, or how to get involved.</p>
            </div>
            <div className="buttons-container">
                {/* Use Link components for navigation */}
                <Link to="/login" className="login-button">Login</Link>
                <Link to="#" className="contact-button">Contact</Link>
                <Link to="#" className="account-button">About</Link>
            </div>
        </div>
    );
}

export default Home;

