import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Navbar from "./components/navbar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

function AuditView() {
    const navigate = useNavigate();


    const [auditList, setAuditList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [filters, setFilters] = React.useState({
        Date: ""

    })




    useEffect(() => {
        Axios.get("http://localhost:3001/audit").then((response) => {
            setAuditList(response.data);
            setRecords(response.data);
        })
    }, [])


    const handleView = (id) => {
        navigate(`/audit/${id}`)
    }

    function handleChange(event) {
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                [event.target.name]: event.target.value
            }
        })
    }

    function clearFilters(e) {
        e.preventDefault();

        setFilters({
            Date: ""
        })
        setRecords(auditList)
    }


    function handleSubmit(e) {
        e.preventDefault();
        var temp = auditList;


        if (filters.Date != "") {
            temp = temp.filter(f => new Date(f.Date) >= new Date(filters.Date))
        }


        setRecords(temp);
    }

    return (
        <div>
            <Navbar />
            <form onSubmit={handleSubmit}>

                <label>
                    Date Range
                    <input type="date" name="Date" value={filters.Date} onChange={handleChange} />
                </label>



                <input type="submit" value="Filter" />
                <button onClick={clearFilters}>Clear</button>
            </form>
            <Button variant="contained"><Link to="/audit/new">Add</Link></Button>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Inventory Affected</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((val) => {
                        return (
                            <TableRow>
                                <TableCell>{val.Date}</TableCell>
                                <TableCell>{val.Affected}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleView(val.Audit_id)}>View</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    );
}

export default AuditView;