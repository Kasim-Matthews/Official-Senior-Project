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

function ViewAudit() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [date, setDate] = React.useState("")


    useEffect(() => {
        Axios.get(`http://localhost:3001/audit/${id}/view`).then((response) => {
            setRecord(response.data)
            setDate(response.data[0].Date)
        });
    }, [])


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