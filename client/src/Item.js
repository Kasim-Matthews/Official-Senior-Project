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

function Item(){
    const navigate = useNavigate();

    const [itemList, setItemList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/item").then((response) =>{
            setItemList(response.data);
        })
    })

    const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3001/item/remove/${id}`);
    }

    const handleEdit = (id) => {
        navigate(`/item/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/item/${id}`)
      }

    return(
        <div>
            <Navbar />
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Fair Market Value</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {itemList.map((val) => {
                        return (
                            <TableRow>
                                <TableCell>{val.Name}</TableCell>
                                <TableCell>{val.FairMarketValue}</TableCell>
                                <TableCell>
                                    <Button varaint="outlined" onClick={() => handleRemove(val.Item_id)}>Delete</Button>
                                    <Button varaint="outlined" onClick={() => handleEdit(val.Item_id)}>Edit</Button>
                                    <Button varaint="outlined" onClick={() => handleView(val.Item_id)}>View</Button>
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

export default Item;