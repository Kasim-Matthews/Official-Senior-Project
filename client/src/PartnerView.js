import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter } from '@mui/material';
import Button from '@mui/material/Button';


function PartnerView(){

    const [partnerList, setPartnerList] = useState([])
    const navigate = useNavigate();
    
    const handleRemove = (id) => {
        let date = new Date().toLocaleDateString();
        Axios.put(`http://localhost:3001/partner/remove/${id}`, {date: date});
        window.location.reload(false);
    }

    const handleEdit = (id) =>{
        navigate(`/partner/${id}/edit`)
    }
    
    const handleView =(id) => {
        navigate(`/partner/${id}`)
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/partner").then((response) => {
            setPartnerList(response.data)
        })
    }, [])

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ bgcolor: '#065AB0'}}>
                    <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/Dashboard" style={{ textDecoration: 'none', color: 'white' }}>{'Dashboard'}</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/distribution" style={{ textDecoration: 'none', color: 'white' }}>Distributions</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/intake" style={{ textDecoration: 'none', color: 'white' }}>Collections</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="#" style={{ textDecoration: 'none', color: 'white' }}>Inventory</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/partner" style={{ textDecoration: 'none', color: 'white' }}>Partner</Link>
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
                        </div>
                    </Toolbar>
                </AppBar>
                </Box>
            <button><Link to="/partner/new">Add</Link></button>
            <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 450 }} aria-label="a simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="right">Name</TableCell>
                                                    <TableCell align="right">Email</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {partnerList.map((val) => {
                                                return (
                                                    <TableRow>
                                                        <TableCell>{val.Name}</TableCell>
                                                        <TableCell>{val.Email}</TableCell>
                                                        <TableCell>
                                                            <Button onClick={() => handleRemove(val.Partner_id)}>Delete</Button>
                                                            <Button onClick={() => handleEdit(val.Partner_id)}>Edit</Button>
                                                            <Button onClick={() => handleView(val.Partner_id)}>View</Button>
                                                        </TableCell>

                                                    </TableRow>
                                                );
                                            })}
                                            </TableBody>
                                            <TableFooter>
                                            </TableFooter>
                                        </Table>
                                    </TableContainer>
           
            <p style={{ display: "none" }}>Make sure when doing input validation you give an error if email is already used and don't allow submit, can cause some weird errors</p>
        </div>
    );
}

export default PartnerView;