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


    useEffect(() => {
        Axios.get(`http://localhost:3001/manufacturers/${id}/view`).then((response) => {
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
            console.error(error.response.data.message)
        });
    }, [])

    const handleView = (id) => {
        navigate(`/intake/${id}`)
    }



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
                    {record.map((val) => {
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