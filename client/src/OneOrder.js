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

function ViewOrder() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = React.useState([])
  const [itemList, setItemList] = React.useState([])

  useEffect(() => {
    Axios.get(`http://localhost:3001/distribution/${id}/view`).then((response) => {
      setRecord(response.data[0])
    });
  }, [])

  useEffect(() => {
    Axios.get(`http://localhost:3001/distribution/${id}/itemlist`).then((response) => {
      setItemList(response.data)
    });
  }, [])

  const totalQuantity = itemList.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
  const total = itemList.reduce((sum, val) => sum + (parseFloat(val.Quantity) * parseFloat(val.FairMarketValue)), 0);

  return (
    <div>
      <Navbar />
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell>Partner</TableCell>
                      <TableCell>Requested Date</TableCell>
                      <TableCell>Completed Date</TableCell>
                      <TableCell>Delivery Method</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                      <TableCell>{record.Name}</TableCell>
                      <TableCell>{record.RequestDate}</TableCell>
                      <TableCell>{record.CompletedDate}</TableCell>
                      <TableCell>{record.DeliveryMethod}</TableCell>
                      <TableCell>{record.Location}</TableCell>
                      <TableCell>{record.Status}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </TableContainer>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Value/item</TableCell>
                      <TableCell>In-kind Value</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {itemList.map((val) => {
                  return (
                    <TableRow>
                      <TableCell>{val.Item}</TableCell>
                      <TableCell>{val.FairMarketValue}</TableCell>
                      <TableCell>${Math.round((val.FairMarketValue * val.Quantity) * 100) / 100}</TableCell>
                      <TableCell>{val.Quantity}</TableCell>
                    </TableRow>
                  )
                })}
                </TableBody>
                <TableFooter>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell>${total}</TableCell>
                  <TableCell>{totalQuantity}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            </TableContainer>
    </div>
  )
}

export default ViewOrder;