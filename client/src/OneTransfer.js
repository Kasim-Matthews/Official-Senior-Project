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
    const [info, setInfo] = React.useState({})


    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/transfer/${id}/view`).then((response) => {
            if (response.data.status === 'complete') {
                setRecord(response.data.data)
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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/transfer/${id}/info`).then((response) => {
            if (response.data.status === 'complete') {
                response.data.data.map((key, value) => { setInfo(key) });
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

    if ((Object.keys(info) == 0 && record.length == 0) || (Object.keys(info) == 0 || record.length == 0)) {
        return (
            <div>

                <table>
                    <thead>
                        <tr>
                            <h3>Transfer from to  on </h3>
                        </tr>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>

                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }

    else {
        return (
            <div>

                <table>
                    <thead>
                        <tr>
                            <h3>Transfer from {info.Taken} to {info.Given} on {new Date(info.Date).toISOString().slice(0, 10)}</h3>
                        </tr>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {record.map((val) => {
                            return (
                                <tr>
                                    <td>{val.Item}</td>
                                    <td>{val.Quantity}</td>
                                </tr>
                            )
                        })}
                    </tbody>
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
    //                  <h3>{`Transfer from ${record.Taken} to ${record.Given} on ${record.Date}`}</h3>
    //                 </TableRow>
    //                 <TableRow>
    //                     <TableCell>Item</TableCell>
    //                     <TableCell>Quantity</TableCell>
    //                 </TableRow>
    //             </TableHead>
    //             <TableBody>
    //             {record.map((val) => {
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
    //     </div>
    // )
}

export default ViewTransfer;