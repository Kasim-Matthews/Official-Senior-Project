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
import { TableFooter } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';

function Dashboard() {

    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);

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

    const handleChange = (event) => {
        setAuth(event.target.checked);
      };
    
      const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
    };

    const filteredItems = selectedLocation 
    ? items.filter(item => item.locationName === selectedLocation)
    : items;

    const totalQuantity = filteredItems.reduce((sum, item) => sum + item.Quantity, 0);


    return (
        <div className="dashboard-container">
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link href="/Dashboard" underline="none">Dasboard</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/distribution" underline="none">Distributions</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/intake" underline="none">Collections</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <a href="#" underline="none">Inventory</a>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/partner" underline="none">Partner</Link>
                    </Typography>
                        <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                        </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                </Box>
            <div className="main-content">
                    <h1>Welcome, DBNF Admin!</h1>
                <div className="boxes">
                    <div className="box">
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
                    </CardContent>
                </Card>
            </div></>
    );
}

export default Dashboard;