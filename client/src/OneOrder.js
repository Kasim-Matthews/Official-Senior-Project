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

function ViewOrder() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = React.useState([])
  const [itemList, setItemList] = React.useState([])

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/view`).then((response) => {
      if (response.data.status === 'complete') {
        setRecord(response.data.data[0])
      }
      else if (response.data.status === 'error in query') {
        navigate('/query')
        console.error("Fail in the query")
        console.error(response.data.message)
      }

    }).catch(error => {
      navigate('/error')
      console.error(error)
    })
  }, [])

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/distribution/${id}/itemlist`).then((response) => {
      if (response.data.status === 'complete') {
        setItemList(response.data.data)
      }
      else if (response.data.status === 'error in query') {
        navigate('/query')
        console.error("Fail in the query")
        console.error(response.data.message)
      }

    }).catch(error => {
      navigate('/error')
      console.log(error)
    })
  }, [])


  // if ((record.length == 0 && itemList.length == 0) || (record.length == 0 || itemList.length == 0)) {
  //   return (
  //     <div>
  //       <table>
  //         <thead>
  //           <tr>
  //             <th>Partner</th>
  //             <th>Requested Date</th>
  //             <th>Completed Date</th>
  //             <th>Delivery Method</th>
  //             <th>Location</th>
  //             <th>Status</th>
  //           </tr>
  //         </thead>

  //       </table>

  //       <table>
  //         <thead>
  //           <tr>
  //             <th>Item Name</th>
  //             <th>Value/item</th>
  //             <th>In-kind Value</th>
  //             <th>Quantity</th>
  //           </tr>
  //         </thead>

  //         <tfoot>
  //           <tr>
  //             <td>Total</td>

  //           </tr>
  //         </tfoot>
  //       </table>
  //       <button><Link to="/Dashboard">Dasboard</Link></button>
  //     </div>
  //   )
  // }


  // else {
  //   const totalQuantity = itemList.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
  //   const total = itemList.reduce((sum, val) => sum + (parseFloat(val.Quantity) * parseFloat(val.FairMarketValue)), 0);

  //   return (
  //     <div>
  //       <table>
  //         <thead>
  //           <tr>
  //             <th>Partner</th>
  //             <th>Requested Date</th>
  //             <th>Completed Date</th>
  //             <th>Delivery Method</th>
  //             <th>Location</th>
  //             <th>Status</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           <tr>
  //             <td>{record.Name}</td>
  //             <td>{new Date(record.RequestDate).toISOString().slice(0, 10)}</td>
  //             <td>{new Date(record.CompletedDate).toISOString().slice(0, 10)}</td>
  //             <td>{record.DeliveryMethod}</td>
  //             <td>{record.Location}</td>
  //             <td>{record.Status}</td>
  //           </tr>
  //         </tbody>
  //       </table>

  //       <table>
  //         <thead>
  //           <tr>
  //             <th>Item Name</th>
  //             <th>Value/item</th>
  //             <th>In-kind Value</th>
  //             <th>Quantity</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {itemList.map((val) => {
  //             return (
  //               <tr>
  //                 <td>{val.Item}</td>
  //                 <td>{val.FairMarketValue}</td>
  //                 <td>${Math.round((val.FairMarketValue * val.Quantity) * 100) / 100}</td>
  //                 <td>{val.Quantity}</td>
  //               </tr>
  //             )
  //           })}
  //         </tbody>
  //         <tfoot>
  //           <tr>
  //             <td>Total</td>
  //             <td></td>
  //             <td>${total}</td>
  //             <td>{totalQuantity}</td>
  //           </tr>
  //         </tfoot>
  //       </table>
  //       <button><Link to="/Dashboard">Dasboard</Link></button>
  //     </div>
  //   )
  // }
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