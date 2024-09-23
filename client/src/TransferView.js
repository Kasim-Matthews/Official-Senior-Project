import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Pagination from "./components/Pagination";
import Navbar from './components/navbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import TextField from "@mui/material/TextField";
import useAxiosPrivate from "./hooks/useAxiosPrivate";


function TransferView() {
    const navigate = useNavigate();

    const [partners, setPartners] = React.useState([])
    const [locations, setLocations] = React.useState([])

    const [transferList, setTransferList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [filters, setFilters] = React.useState({
        From: "",
        To: "",
        start: "",
        end:""

    })
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(3);

    //Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = records.slice(indexOfFirstPost, indexOfLastPost)


    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/transfer`).then((response) => {
            setTransferList(response.data.data);
            setRecords(response.data.data);
        })
    }, [])

    const handleRemove = async (id, Name, Location) => {
        if (window.confirm(`Are you sure you want to delete ${Name}'s transfer from the transfer list?`) == true) {
            try {
                const response = await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/transfer/reclaim`, { id: id, Location: Location })


                if (response.status == 400) {
                    alert("Contact developer")
                }

                else if (response.status == 200) {
                    window.location.reload(false);
                }
            }

            catch (error) {
                alert("Server side error/Contact developer")
            }
        }
    }

    const handleView = (id) => {
        navigate(`/transfer/${id}`)
    }

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/transfer/adjustment`).then((response) => {
            if (response.data.status === 'complete') {
                setPartners(response.data.data);
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

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/location`).then((response) => {
            if (response.data.status === 'complete') {
                setLocations(response.data.data);
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
            From: "",
            To: "",
            start:"",
            end:""
        })
        setRecords(transferList)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = transferList;

        if (filters.From != "") {
            temp = temp.filter(f => f.Taken == filters.From);
        }

        if (filters.To != "") {
            temp = temp.filter(f => f.Given == filters.To);
        }


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

    // return (
    //     <div>

    //         <form onSubmit={handleSubmit}>
    //             <label htmlFor="From">
    //                 From
    //                 <select id="From" name="From" value={filters.From} onChange={handleChange}>
    //                     <option value=""></option>
    //                     {partners.map((val) => {
    //                         return (
    //                             <option value={val.Name}>{val.Name}</option>
    //                         )
    //                     })}

    //                 </select>

    //             </label>

    //             <label htmlFor="To">
    //                 To
    //                 <select id="To" name="To" value={filters.To} onChange={handleChange}>
    //                     <option value=""></option>
    //                     {locations.map((val) => {
    //                         return (
    //                             <option value={val.Name}>{val.Name}</option>
    //                         )
    //                     })}

    //                 </select>

    //             </label>
    //             <label>
    //                 Date Range
    //                 <div>
    //                 <input type="date" name="start" value={filters.start} onChange={handleChange} />
    //                 -
    //                 <input type="date" name="end" value={filters.end} onChange={handleChange} />
    //                 </div>
    //             </label>



    //             <input type="submit" value="Filter" />
    //             <button onClick={clearFilters}>Clear</button>
    //         </form>
    //         <button><Link to="/transfer/new">Add</Link></button>
    //         <table>
    //             <thead>
    //                 <tr>
    //                     <th>From</th>
    //                     <th>To</th>
    //                     <th>Date</th>
    //                     <th>Comments</th>
    //                     <th>Total Moved</th>
    //                     <th>Actions</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {currentPosts.map((val) => {
    //                     if (val.Comments == null || val.Comments == "undefined") {
    //                         return (
    //                             <tr>
    //                                 <td>{val.Taken}</td>
    //                                 <td>{val.Given}</td>
    //                                 <td>{new Date(val.Date).toISOString().slice(0, 10)}</td>
    //                                 <td></td>
    //                                 <td>{val.TotalMoved}</td>
    //                                 <td>
    //                                     <button onClick={() => handleRemove(val.Intake_id, val.Taken, val.Location)}>Delete</button>
    //                                     <button onClick={() => handleView(val.Intake_id)}>View</button>
    //                                 </td>
    //                             </tr>
    //                         );
    //                     }

    //                     else {
    //                         return (
    //                             <tr>
    //                                 <td>{val.Taken}</td>
    //                                 <td>{val.Given}</td>
    //                                 <td>{new Date(val.Date).toISOString().slice(0, 10)}</td>
    //                                 <td>{val.Comments}</td>
    //                                 <td>{val.TotalMoved}</td>
    //                                 <td>
    //                                     <button onClick={() => handleRemove(val.Intake_id, val.Taken, val.Location)}>Delete</button>
    //                                     <button onClick={() => handleView(val.Intake_id)}>View</button>
    //                                 </td>
    //                             </tr>
    //                         );
    //                     }
    //                 })}
    //             </tbody>
    //         </table>
    //         <button><Link to="/Dashboard">Dasboard</Link></button>
    //         <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />
    //     </div>
    // );

    return (
        <div>
            <Navbar />
            <React.Fragment>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Filters</Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const email = formJson.email;
                            console.log(email);
                            handleClose();
                        },
                    }}
                >
                    <DialogTitle>Filters</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <div className='from'>
                            <TextField
                                    id="outlined-select-from"
                                    select
                                    label="From"
                                    defaultValue="From"
                                    helperText="Please select a partner"
                                >
                        <option value=""></option>
                        {partners.map((val) => {
                            return (
                                <option value={val.Name}>{val.Name}</option>
                            )
                        })}

                    </TextField>
                            </div>
                            <div className='to'>
                                <TextField
                                    id="outlined-select-to"
                                    select
                                    label="To"
                                    defaultValue="To"
                                    helperText="Please select a location"
                                >
                                    <option value=""></option>
                                    {locations.map((val) => {
                                        return (
                                            <option value={val.Name}>{val.Name}</option>
                                        )
                                    })}
                                </TextField>
                            </div>
                            <div className='date'>
                            <label>
                                Date Range
                                <input type="date" name="Date" value={filters.Date} onChange={handleChange} />
                            </label>
                            </div>
                            <div className='submit'>
                                <DialogActions>
                                    <input type="submit" value="Filter" />
                                    <button onClick={clearFilters}>Clear</button>
                                </DialogActions>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
            <Button variant="contained"><Link to="/transfer/new">Add</Link></Button>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Comments</TableCell>
                        <TableCell>Total Moved</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {records.map((val) => {
                            return (
                                <TableRow>
                                    <TableCell>{val.Taken}</TableCell>
                                    <TableCell>{val.Given}</TableCell>
                                    <TableCell>{val.Date}</TableCell>
                                    <TableCell>{val.Comments}</TableCell>
                                    <TableCell>{val.TotalMoved}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" onClick={() => handleRemove(val.Intake_id, val.Taken, val.Location)}>Delete</Button>
                                        <Button variant="outlined" onClick={() => handleView(val.Intake_id)}>View</Button>
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

export default TransferView;