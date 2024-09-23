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
import Button from '@mui/material/Button';

function ViewDrive() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})
    const [intakeList, setIntakeList] = React.useState([])

    const handleView = (id) => {
        navigate(`/donation/${id}`)
    }


    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/productdrive/${id}/edit`).then((response) => {
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
            console.error(error.response.data.message)
        });
    }, [])

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/productdrive/${id}/view`).then((response) => {
            if (response.data.status === 'complete') {
                setIntakeList(response.data.data)
            }

            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query")
                console.error(response.data.message)
            }

        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        });
    }, [])


    // if (intakeList.length === 0) {
    //     return (
    //         <div>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Name</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     <tr>
    //                         <td>{record.Name}</td>
    //                     </tr>
    //                 </tbody>
    //             </table>

    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Location</th>
    //                         <th>Quantity</th>
    //                         <th>Total Items</th>
    //                         <th>Details</th>
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
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Name</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     <tr>
    //                         <td>{record.Name}</td>
    //                     </tr>
    //                 </tbody>
    //             </table>

    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Location</th>
    //                         <th>Quantity</th>
    //                         <th>Total Items</th>
    //                         <th>Details</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {intakeList.map((val) => {
    //                         return (
    //                             <tr>
    //                                 <td>{val.Location}</td>
    //                                 <td>{val.Quantity}</td>
    //                                 <td>{val.TotalItems}</td>
    //                                 <td>
    //                                     <button onClick={() => handleView(val.Intake_id)}>View Details</button>
    //                                 </td>
    //                             </tr>
    //                         )
    //                     })}
    //                 </tbody>
    //             </table>
    //             <button><Link to="/Dashboard">Dasboard</Link></button>
    //         </div>
    //     )
    // }

    if (intakeList.length === 0) {
        return (
            <div>
                <Navbar />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{record.Name}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Location</TableCell>
                                <TableCell>Total Iteams</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </div>
        )
    }

    else {
        return (
            <div>
                <Navbar />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Donation Site</TableCell>
                                <TableCell>Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{record.Name}</TableCell>
                                <TableCell>{record.Address}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Location</TableCell>
                                <TableCell>Total Iteams</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {intakeList.map((val) => {
                                return (
                                    <TableRow>
                                        <TableCell>{val.Location}</TableCell>
                                        <TableCell>{val.Quantity}</TableCell>
                                        <TableCell>{val.TotalItems}</TableCell>
                                        <TableCell>
                                            <Button variant="outined" onClick={() => handleView(val.Intake_id)}>View Details</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }

}
/*Cannot edit till the purchase functionality is a thing*/

export default ViewDrive;