import React, { useEffect } from "react";
import Axios from 'axios';
import { useParams, Link } from "react-router-dom";
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

function ViewPurchase() {

    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [itemList, setItemList] = React.useState([])

    useEffect(() => {
        Axios.get(`http://localhost:3001/purchase/${id}/view`).then((response) => {
            setRecord(response.data[0])
            setItemList(response.data)
        });
    }, [])

    const totalQuantity = itemList.reduce((sum, val) => sum + parseInt(val.Quantity), 0);

    return (
        <div>
            <Navbar />
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Received Date</TableCell>
                      <TableCell>Storage Location</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {itemList.map((val) => {
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
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                      <TableCell>{record.Vendor}</TableCell>
                      <TableCell>{record.PurchaseDate}</TableCell>
                      <TableCell>{record.Location}</TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>${totalQuantity}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            </TableContainer>
        </div>
    )
}

export default ViewPurchase;