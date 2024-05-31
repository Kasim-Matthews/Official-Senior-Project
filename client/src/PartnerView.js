import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter } from '@mui/material';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import ErrorHandler from "./ErrorHandler";
import AppBar from '@mui/material/AppBar';
import Navbar from './components/navbar';

function PartnerView() {

    const [partnerList, setPartnerList] = useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)
    const navigate = useNavigate();

    const handleRemove = (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the partner list?`) == true) {
            let date = new Date().toLocaleDateString();
            Axios.put(`http://localhost:3001/partner/remove/${id}`, { date: date });
            window.location.reload(false);
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

    const handleReactivate = (id, Name) => {
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the partner list?`) == true) {
            Axios.put(`http://localhost:3001/partner/reactivate/${id}`);
            window.location.reload(false);
        }
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/partner").then((response) => {
            setPartnerList(response.data)
            setRecords(response.data.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        })
    }, [])


    if (partnerList[0] == "error") {
        return (
            <ErrorHandler />
        )
    }


    return (
        <div>
            <Navbar />
            <Button variant="contained"><Link to="/partner/new" style={{ textDecoration: 'none', color: 'white' }}>Add Partner</Link></Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 450 }} aria-label="a simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Actions</TableCell>
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