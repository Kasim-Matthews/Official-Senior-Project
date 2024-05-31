import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, Link} from "react-router-dom";
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

function Location(){
    const navigate = useNavigate();

    const [locationList, setLocationList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/location").then((response) =>{
            setLocationList(response.data);
        })
    })

    const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3001/location/remove/${id}`);
    }

    const handleEdit = (id) => {
        navigate(`/location/${id}/edit`)
    }

    return(
        <div>
            <Navbar />
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {locationList.map((val) => {
                        return (
                            <TableRow>
                                <TableCell>{val.Name}</TableCell>
                                <TableCell>{val.Address}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleRemove(val.Location_id)}>Delete</Button>
                                    <Button variant="outlined" onClick={() => handleEdit(val.Location_id)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    );
}

export default Location;