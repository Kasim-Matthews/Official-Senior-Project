import React, { useState, useEffect }  from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';
import './Dashboard.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { TableFooter } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Dashboard() {

    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3306/item-location-data')
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
            <div className="header">
                <nav className="navbar">
                    <ul>
                        <li><Link to="/Dashboard">Dasboard</Link></li>
                        <li><Link to="/distribution">Distributions</Link></li>
                        <li><Link to="/intake">Collections</Link></li>
                        <li><a href="#">Inventory</a></li>
                        <li><Link to="/partner">Partner</Link></li>
                        <li><a href="#">User Profile</a></li>
                    </ul>
                </nav>
            </div>
            <div className="main-content">
                    <h1>Welcome, DBNF Admin!</h1>
                    <Box height={275}
                         width={500}
                         my={4}
                         display="flex"
                         alignItems="center"
                         gap={4}
                         p={2}
                         borderRadius={2}
                         sx={{ border: '1px solid grey' }}>
                        <div className="content">
                        <h2>Item Locations</h2>
                            <div className="filter-section">
                                <FormControl fullWidth>
                                 <InputLabel id="selectedLocation">Location</InputLabel>
                                    <Select labelId="selectedLocation" id="selectedLocation" value={selectedLocation} label="Location" onChange={handleLocationChange}>
                                        <MenuItem value={''}>All Locations</MenuItem>
                                        {locations.map((location, index) => (
                                        <MenuItem key={index} value={location}>{location}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <div className="item-table">
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 450 }} aria-label="a simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">Item Name</TableCell>
                                                <TableCell align="right">Location Name</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredItems.map((item, index) => (
                                            <TableRow key={index}
                                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell>{item.itemName}</TableCell>
                                                <TableCell>{item.locationName}</TableCell>
                                                <TableCell>{item.Quantity}</TableCell>
                                            </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan="2">Total Number of Items</TableCell>
                                                <TableCell>{totalQuantity}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                                </div>
                            </div>
                        </div>
                    </Box>
                </div>
            </div>
    );
}

export default Dashboard;