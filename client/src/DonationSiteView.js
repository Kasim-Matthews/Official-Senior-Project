import React, { useState, useEffect } from "react";
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

function DonationSiteView() {

    const [dsiteList, setDsiteList] = useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)
    const navigate = useNavigate();

    const handleRemove = (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the donation site list?`) == true) {
            let date = new Date().toLocaleDateString();
            Axios.put(`http://localhost:3001/donationsite/remove/${id}`, { date: date });
            window.location.reload(false);
        }

    }

    const handleReactivate = (id, Name) => {
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the donation site list?`) == true) {
            Axios.put(`http://localhost:3001/donationsite/reactivate/${id}`);
            window.location.reload(false);
        }
    }

    const handleEdit = (id) => {
        navigate(`/donationsite/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/donationsite/${id}`)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = dsiteList;

        if (nonActive) {
            setRecords(temp)
        }

        else {
            setRecords(temp.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        }
    }

    useEffect(() => {
        Axios.get("http://localhost:3306/donationsite").then((response) => {
            if (response.data.status === 'complete') {
                setDsiteList(response.data.data)
                setRecords(response.data.data.filter(function (currentObject) {
                    return typeof (currentObject.DeletedAt) == "object";
                }))
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


    if (records.length === 0) {
        return (
            <div>
                <Navbar/>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex" }}>

                        <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                        <label htmlFor="non-active" >Also include inactive items</label>

                    </div>
                    <input type="Submit" />
                </form>
                <Button variant="contained"><Link to="/donationsite/new">Add</Link></Button>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableRow>Donation Site</TableRow>
                            <TableRow>Address</TableRow>
                            <TableRow>Actions</TableRow>
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
                <Navbar/>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex" }}>

                        <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                        <label htmlFor="non-active" >Also include inactive items</label>

                    </div>
                    <input type="Submit" />
                </form>
                <Button variant="contained"><Link to="/donationsite/new">Add</Link></Button>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Donation Site</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((val) => {
                            return (
                                <TableRow>
                                    <TableCell>{val.Name}</TableCell>
                                    <TableCell>{val.Address}</TableCell>
                                    <TableCell>
                                        {typeof val.DeletedAt == "object" ? <Button variant="outlined" onClick={() => handleRemove(val.Partner_id, val.Name)}>Delete</Button> : <Button variant="outlined" onClick={() => handleReactivate(val.Partner_id, val.Name)}>Reactivate</Button>}
                                        <Button variant="outlined" onClick={() => handleEdit(val.Partner_id)}>Edit</Button>
                                        <Button variant="outlined" onClick={() => handleView(val.Partner_id)}>View</Button>
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
}

export default DonationSiteView;