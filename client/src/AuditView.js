import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./components/navbar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Pagination from "./components/Pagination";

function AuditView() {
    const navigate = useNavigate();


    const [auditList, setAuditList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [filters, setFilters] = React.useState({
        start: "",
        end: ""

    })

    const paginate = pageNumber => setCurrentPage(pageNumber);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(3);

    //Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = records.slice(indexOfFirstPost, indexOfLastPost)


    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/audit`).then((response) => {
            if (response.data.status === 'complete') {
                setAuditList(response.data.data);
                setRecords(response.data.data);
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
            Date: { start: "", end: "" }
        })
        setRecords(auditList)
    }


    function handleSubmit(e) {
        e.preventDefault();
        var temp = auditList;


        if (filters.start != "" && filters.end == "") {
            temp = temp.filter(f => new Date(f.Date) >= new Date(filters.start))
        }
        if (filters.end != "" && filters.start == "") {
            temp = temp.filter(f => new Date(f.Date) <= new Date(filters.end))
        }
        if (filters.start != "" && filters.end != "") {
            temp = temp.filter(f => (new Date(f.Date) >= new Date(filters.start)) && (new Date(f.Date) <= new Date(filters.end)))
        }


        setRecords(temp);
    }

    return (
        <div>
            <Navbar />
            <form onSubmit={handleSubmit}>

                <label>
                    Date Range
                    <div>
                        <input type="date" name="start" value={filters.start} onChange={handleChange} />
                        -
                        <input type="date" name="end" value={filters.end} onChange={handleChange} />
                    </div>
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
            <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />
        </div>
    );
}

export default AuditView;