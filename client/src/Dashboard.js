import React from 'react';
import './Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard-container">

            <nav className="sidebar">
                <h2>Inventory Management System</h2>
                <ul>
                    <li><a href="#">Dashboard</a></li>
                    <li><a href="#">Distributions</a></li>
                    <li><a href="#">Collections</a></li>
                    <li><a href="#">Inventory</a></li>
                    <li><a href="#">Partner Agencies</a></li>
                </ul>
            </nav>

            <div className="main-content">

                <header className="dashboard-header">
                    <h1>Diaper Bank for Northeast Florida - Dashboard</h1>

                    <div className="user-profile"><a href="#">User Profile</a></div>
                </header>

                <div className="content">
                    {/* dashboard stuff */}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;