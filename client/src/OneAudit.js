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

function ViewAudit() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [date, setDate] = React.useState("")


    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/audit/${id}/view`).then((response) => {
            if (response.data.status === 'complete') {
                setRecord(response.data.data)
                setDate(response.data.data[0].Date)
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

    // if ((record.length == 0 && date == "") || (record.length == 0 || date == "")) {
    //     return (
    //         <div>
    //             <header>Audit was created on </header>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Item</th>
    //                         <th>Location</th>
    //                         <th>Previous Value</th>
    //                         <th>Changed Value</th>
    //                     </tr>
    //                 </thead>

    //             </table>
    //             <button><Link to="/Dashboard">Dasboard</Link></button>
    //         </div>
    //     )
    // }


    // else {
    //     return (
    //         <div>
    //             <header>Audit was created on {new Date(date).toISOString().slice(0, 10)}</header>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Item</th>
    //                         <th>Location</th>
    //                         <th>Previous Value</th>
    //                         <th>Changed Value</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {record.map((val) => {
    //                         if (val.Changed != null) {
    //                             return (
    //                                 <tr>
    //                                     <td>{val.Item}</td>
    //                                     <td>{val.Location}</td>
    //                                     <td>{val.Past}</td>
    //                                     <td>{val.Changed}</td>
    //                                 </tr>
    //                             )
    //                         }

    //                         else {
    //                             return (
    //                                 <tr>
    //                                     <td>{val.Item}</td>
    //                                     <td>{val.Location}</td>
    //                                     <td>{val.Past}</td>
    //                                     <td></td>
    //                                 </tr>
    //                             )
    //                         }
    //                     })}
    //                 </tbody>
    //             </table>
    //             <button><Link to="/Dashboard">Dasboard</Link></button>
    //         </div>
    //     )
    // }

    return (
        <div>
            <Navbar />
            <header>Audit was created on {new Date(date).toLocaleDateString()}</header>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Previous Value</TableCell>
                        <TableCell>Changed Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {record.map((val) => {
                        if(val.Changed != null){
                            return (
                                <TableRow>
                                    <TableCell>{val.Item}</TableCell>
                                    <TableCell>{val.Location}</TableCell>
                                    <TableCell>{val.Past}</TableCell>
                                    <TableCell>{val.Changed}</TableCell>
                                </TableRow>
                            )
                        }

                        else{
                            return (
                                <TableRow>
                                    <TableCell>{val.Item}</TableCell>
                                    <TableCell>{val.Location}</TableCell>
                                    <TableCell>{val.Past}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            )
                        }
                    })}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    )
}

export default ViewAudit;