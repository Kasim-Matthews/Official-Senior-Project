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
import ErrorHandler from "./ErrorHandler";

function PartnerView() {

    const [partnerList, setPartnerList] = useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)
    const navigate = useNavigate();

    const handleRemove = async (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the partner list?`) == true) {
            let date = new Date().toLocaleDateString();
            try {
                await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/partner/remove/${id}`, { date: date }).then((response) => {

                    if (response.status == 400) {
                        alert("Contact developer")
                    }

                    else if (response.status == 200) {
                        window.location.reload(false);
                    }
                })


            }
            catch (error) {
                alert("Server side error/Contact developer")
            }
        }

    }

    const handleEdit = (id) => {
        navigate(`/partner/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/partner/${id}`)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = partnerList;

        if (nonActive) {
            setRecords(temp)
        }

        else {
            setRecords(temp.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        }
    }

    const handleReactivate = async (id, Name) => {
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the partner list?`) == true) {
            try {
                await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/partner/reactivate/${id}`).then((response) => {

                    if (response.status == 400) {
                        alert("Contact developer")
                    }

                    else if (response.status == 200) {
                        window.location.reload(false);
                    }
                })

            }
            catch (error) {
                alert("Server side error/Contact developer")
            }
        }
    }

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/partner`).then((response) => {
            if (response.data.status === 'complete') {
                setPartnerList(response.data.data)
                setRecords(response.data.data.filter(function (currentObject) {
                    return typeof (currentObject.DeletedAt) == "object";
                }))
            }

            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query")
                console.error(response.data.message)
            }

        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        })
    }, [])


    if (partnerList[0] == "error") {
        return (
            <ErrorHandler />
        )
    }


    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ bgcolor: '#065AB0' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/Dashboard" style={{ textDecoration: 'none', color: 'white' }}>{'Dashboard'}</Link>
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/distribution" style={{ textDecoration: 'none', color: 'white' }}>Distributions</Link>
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/donation" style={{ textDecoration: 'none', color: 'white' }}>Collections</Link>
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
            <form onSubmit={handleSubmit}>
                <div style={{ display: "flex" }}>

                    <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                    <label htmlFor="non-active" >Also include inactive items</label>

                </div>
                <input type="Submit" />
            </form>
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
                        {records.map((val) => {
                            return (
                                <TableRow>
                                    <TableCell>{val.Name}</TableCell>
                                    <TableCell>{val.Email}</TableCell>
                                    <TableCell>
                                        {typeof val.DeletedAt == "object" ? <Button onClick={() => handleRemove(val.Partner_id, val.Name)}>Delete</Button> : <Button onClick={() => handleReactivate(val.Partner_id, val.Name)}>Reactivate</Button>}
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