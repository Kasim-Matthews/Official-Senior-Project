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
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import Button from '@mui/material/Button';
import Navbar from './components/navbar';

function Dashboard() {

    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/data')
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

    console.log(locations)

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="main-content">
                    <h1>Welcome, DBNF Admin!</h1>
                <div className="boxes">
                    <div className="box">
                    <Card>
                        <CardContent>
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
                    <div className='pie-chart'>
                    <Card>
                        <CardContent>
                            Pie chart goes here!
                        </CardContent>
                    </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>

    );
}


export default Dashboard;