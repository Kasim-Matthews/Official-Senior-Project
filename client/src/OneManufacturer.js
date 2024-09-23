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

function ViewManufacturer() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [intakeList, setIntakeList] = React.useState([])


    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/manufacturers/${id}/edit`).then((response) => {
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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/manufacturers/${id}/view`).then((response) => {
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
        })
    }, [])

    const handleView = (id) => {
        navigate(`/donation/${id}`)
    }

    // if (intakeList.length === 0) {
    //     return (
    //         <div>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <h3>Past Donations from {record.Name}</h3>
    //                     </tr>
    //                     <tr>
    //                         <th>Date</th>
    //                         <th>Volume</th>
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
    //                         <h3>Past Donations from {record.Name}</h3>
    //                     </tr>
    //                     <tr>
    //                         <th>Date</th>
    //                         <th>Volume</th>
    //                         <th>Details</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {intakeList.map((val) => {
    //                         return (
    //                             <tr>
    //                                 <td>{val.Date}</td>
    //                                 <td>{val.Volume}</td>
    //                                 <td><button onClick={() => handleView(val.Intake_id)}> View donation details</button></td>
    //                             </tr>
    //                         )
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
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Volume</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {intakeList.map((val) => {
                        return (
                            <TableRow>
                                <TableCell>{val.Date}</TableCell>
                                <TableCell>{val.Volume}</TableCell>
                                <TableCell><Button variant="outlined" onClick={() => handleView(val.Intake_id)}> View donation details</Button></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    )

}
/*Cannot edit till the purchase functionality is a thing*/

export default ViewManufacturer;