import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, Link} from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Navbar from "./components/navbar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter } from '@mui/material';
import Button from '@mui/material/Button';

function Partner(){
    const navigate = useNavigate();

    const [partnerList, setPartnerList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/partner").then((response) =>{
            setPartnerList(response.data);
        })
    })

    const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3001/partner/remove/${id}`);
    }

    const handleEdit = (id) => {
        navigate(`/partner/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/partner/${id}`)
      }

    return(
        <div>
            <Navbar />
            <Button variant="contained"><Link to="/partner/new">Add</Link></Button>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                     <h3>{`Transfer from ${record.Taken} to ${record.Given} on ${record.Date}`}</h3>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {partnerList.map((val) => {
                        return(
                            <TableRow>
                                <TableCell>{val.Name}</TableCell>
                                <TableCell>{val.Email}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleRemove(val.Partner_id)}>Delete</Button>
                                    <Button variant="outlined" onClick={() => handleEdit(val.Partner_id)}>Edit</Button>
                                    <Button variant="outlined" onClick={() => handleView(val.Partner_id)}>View</Button>
                                </TableCell>

                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            </TableContainer>
            <p style={{display: "none"}}>Make sure when doing input validation you give an error if email is already used and don't allow submit, can cause some weird errors</p>
        </div>
    );
}

export default Partner;