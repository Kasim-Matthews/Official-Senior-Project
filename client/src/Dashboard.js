import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {

    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/item-location-data')
            .then(response => {
                if (response.data.status === 'ok') {
                    setItems(response.data.data);
                    setLocations([...new Set(response.data.data.map(item => item.locationName))]);
                } else {
                    console.error('Failed to fetch data');
                }
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
    }, []);

    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
    };

    const filteredItems = selectedLocation
        ? items.filter(item => item.locationName === selectedLocation)
        : items;

    const totalQuantity = filteredItems.reduce((sum, item) => sum + item.Quantity, 0);


    return (
        <div className="dashboard-container">

            <nav className="sidebar">
                <h2>Inventory Management System</h2>
                <ul>
                    <li><a href="/Dashboard">Dashboard</a></li>
                    <li><a href="/distribution">Distributions</a></li>
                    <li><a href="/intake">Collections</a></li>
                    <li><a href="/item">Items</a></li>
                    <li><a href="/partner">Partner Agencies</a></li>
                    <li><a href="/location">Locations</a></li>
                </ul>
            </nav>

            <div className="main-content">

                <header className="dashboard-header">
                    <h1>Diaper Bank for Northeast Florida - Dashboard</h1>

                    <div className="user-profile"><a href="#">User Profile</a></div>
                </header>
                <div className="filter-section">
                    <select value={selectedLocation} onChange={handleLocationChange}>
                        <option value="">All Locations</option>
                        {locations.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                        ))}
                    </select>
                </div>
                <div className="content">
                    <h2>Item Locations</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Location Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.itemName}</td>
                                    <td>{item.locationName}</td>
                                    <td>{item.Quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2">Total Number of Items</td>
                                <td>{totalQuantity}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;