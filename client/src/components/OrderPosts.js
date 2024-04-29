import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter } from '@mui/material';
import Button from '@mui/material/Button';

const OrderPosts = ({ posts, handleView, handleEdit, handleComplete, handleIncomplete, handleRemove, handleprint }) => {
    const total = posts.reduce((sum, val) => sum + parseInt(val.Total), 0);
    return (
        <div>
            <div>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 450 }} aria-label="a simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="right">Partner</TableCell>
                                                    <TableCell align="right">Requested Date</TableCell>
                                                    <TableCell align="right">Completed Date</TableCell>
                                                    <TableCell align="right">Total Items</TableCell>
                                                    <TableCell align="right">Delivery Method</TableCell>
                                                    <TableCell align="right">Comments</TableCell>
                                                    <TableCell align="right">Status</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {posts.map((val) => {

                                                return (
                                                    <TableRow>
                                                        <TableCell>{val.Name}</TableCell>
                                                        <TableCell>{new Date(val.RequestDate).toLocaleDateString('en-US', {timeZone: 'America/New_York'})}</TableCell>
                                                        <TableCell>{new Date(val.CompletedDate).toLocaleDateString('en-US', {timeZone: 'America/New_York'})}</TableCell>
                                                        <TableCell>{val.Total}</TableCell>
                                                        <TableCell>{val.DeliveryMethod}</TableCell>
                                                        <TableCell>{val.Comments}</TableCell>
                                                        <TableCell>{val.Status}</TableCell>

                                                        <TableCell>
                                                            <Button onClick={() => handleRemove(val.Order_id, val.Name)}>Reclaim</Button>
                                                            <Button onClick={() => handleprint(val.Order_id)}>Print</Button>
                                                            {val.Status == 'Draft' ? (<Button onClick={() => handleEdit(val.Order_id)}>Edit</Button>) : null}
                                                            <Button onClick={() => handleView(val.Order_id)}>View</Button>
                                                            {val.Status == 'Draft' ? (<Button onClick={() => handleComplete(val.Order_id)}>Complete</Button>) : null}
                                                            {val.Status == 'Submitted' ? (<Button onClick={() => handleIncomplete(val.Order_id)}>Uncomplete</Button>) : null}

                                                        </TableCell>
                                                    </TableRow>);
                                                })}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell>{total}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </TableContainer>
                                </div>
            
        </div>
    )
}

export default OrderPosts
