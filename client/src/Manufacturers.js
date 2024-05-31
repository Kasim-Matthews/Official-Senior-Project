import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, Link} from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter } from '@mui/material';
import Button from '@mui/material/Button';

function Manufacturers(){
    const navigate = useNavigate();

    const [manuList, setManuList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3306/manufacturers").then((response) =>{
            setManuList(response.data);
        })
    })

    const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3306/manufacturers/remove/${id}`);
    }

    const handleEdit = (id) => {
        navigate(`/manufacturers/${id}/edit`)
    }

    return(
        <div>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Market Value</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {manuList.map((val) => {
                        return (
                            <TableRow>
                                <TableCell>{val.Name}</TableCell>
                                <TableCell>0</TableCell>
                                <TableCell>
                                    <Button varaint="outlined" onClick={() => handleRemove(val.id)}>Delete</Button>
                                    <Button varaint="outlined" onClick={() => handleEdit(val.id)}>Edit</Button>
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

export default Manufacturers;