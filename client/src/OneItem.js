import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, useParams, Link} from "react-router-dom";
import Navbar from "./components/navbar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter } from '@mui/material';
import Button from '@mui/material/Button';

function ViewItem(){
    
    const navigate = useNavigate();
    const {id} = useParams();
    const [record, setRecord] = React.useState({})
    
          useEffect(() => {
            Axios.get(`http://localhost:3306/item/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setRecord(key)});
            })
          }, [])

          return(
            <div>
                <Navbar />
                <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Market Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>{record.Name}</TableCell>
                        <TableCell>{record.marketValue}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </TableContainer>
            </div>
          )
}

export default ViewItem;