import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from './components/navbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter } from '@mui/material';
import Button from '@mui/material/Button';

function ViewTransfer() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])


    useEffect(() => {
        Axios.get(`http://localhost:3001/transfer/${id}/view`).then((response) => {
            setRecord(response.data)
        });
    }, [])


    return (
        <div>
            <Navbar />
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                     <h3>{`Transfer from ${record.Taken} to ${record.Given} on ${record.Date}`}</h3>
                    </TableRow>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {record.map((val) => {
                        return (
                            <TableRow>
                                <TableCell>{val.Item}</TableCell>
                                <TableCell>{val.Quantity}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    )
}


export default ViewTransfer;