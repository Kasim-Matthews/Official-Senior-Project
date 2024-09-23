import React, { useEffect } from "react";
import Axios from 'axios';
import { useParams, Link, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/purchase/${id}/view`).then((response) => {
            if (response.data.status === 'complete') {
                setRecord(response.data.data[0])
                setItemList(response.data.data)
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

    if (record.length == 0 && itemList.length == 0) {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Vendor</th>
                            <th>Received Date</th>
                            <th>Storage Location</th>
                        </tr>
                    </thead>

                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>

                    <tfoot>
                        <tr>
                            <th>Total</th>
                        </tr>
                    </tfoot>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }


    else {
        const totalQuantity = itemList.reduce((sum, val) => sum + parseInt(val.Quantity), 0);

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Vendor</th>
                            <th>Purchase Date</th>
                            <th>Storage Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{record.Vendor}</td>
                            <td>{new Date(record.PurchaseDate).toISOString().slice(0, 10)}</td>
                            <td>{record.Location}</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemList.map((val) => {
                            return (
                                <tr>
                                    <td>{val.Item}</td>
                                    <td>{val.Quantity}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <td>{totalQuantity}</td>
                        </tr>
                    </tfoot>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }

    // return (
    //     <div>
    //         <Navbar />
    //         <TableContainer component={Paper}>
    //         <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //             <TableHead>
    //                 <TableRow>
    //                   <TableCell>Vendor</TableCell>
    //                   <TableCell>Received Date</TableCell>
    //                   <TableCell>Storage Location</TableCell>
    //                 </TableRow>
    //             </TableHead>
    //             <TableBody>
    //             {itemList.map((val) => {
    //                     return (
    //                         <TableRow>
    //                             <TableCell>{val.Item}</TableCell>
    //                             <TableCell>{val.Quantity}</TableCell>
    //                         </TableRow>
    //                     )
    //                 })}
    //             </TableBody>
    //         </Table>
    //         </TableContainer>
    //         <TableContainer component={Paper}>
    //         <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //             <TableHead>
    //                 <TableRow>
    //                   <TableCell>Item Name</TableCell>
    //                   <TableCell>Quantity</TableCell>
    //                 </TableRow>
    //             </TableHead>
    //             <TableBody>
    //                 <TableRow>
    //                   <TableCell>{record.Vendor}</TableCell>
    //                   <TableCell>{record.PurchaseDate}</TableCell>
    //                   <TableCell>{record.Location}</TableCell>
    //                 </TableRow>
    //             </TableBody>
    //             <TableFooter>
    //                 <TableRow>
    //                     <TableCell>Total</TableCell>
    //                     <TableCell>${totalQuantity}</TableCell>
    //                 </TableRow>
    //             </TableFooter>
    //         </Table>
    //         </TableContainer>
    //     </div>
    // )

}

export default ViewPurchase;