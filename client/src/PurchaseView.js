import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import PurchasePosts from "./components/PurchasePosts";
import Pagination from "./components/Pagination";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Navbar from './components/navbar';


function Purchase() {
    const navigate = useNavigate();


    const [partners, setPartners] = React.useState([])
    const [locations, setLocations] = React.useState([])
    const [intakeList, setIntakeList] = React.useState([])
    const [records, setRecords] = React.useState([])

    const [filters, setFilters] = React.useState({
        Vendor: "",
        Location: "",
        start: "",
        end: ""

    })



    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(10);

    //Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = records.slice(indexOfFirstPost, indexOfLastPost)

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/purchase`).then((response) => {
            if (response.data.status === 'complete') {
                setIntakeList(response.data.data);
                setRecords(response.data.data)
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

    const paginate = pageNumber => setCurrentPage(pageNumber);




    const handleRemove = async (id, Name) => {
        if (window.confirm(`Are you sure you want to delete this purchase from ${Name}?`) == true) {
            try {
                const response = await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/purchase/reclaim`, { id: id })

                if (response.data.status == 409) {
                    console.log(response.data.data)
                    alert(`These items: ${response.data.data.toString()} quantities are lower than what you want to take away`)
                }

                else if (response.status == 400) {
                    alert("Contact developer")
                }

                else if (response.status == 200 && response.data.status != 409) {
                    window.location.reload(false);
                }
            }

            catch (error) {
                console.log(error)
                alert("Server side error/Contact developer")
            }
        }


    }

    const handleEdit = (id) => {
        navigate(`/purchase/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/purchase/${id}`)
    }

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/vendor/list`).then((response) => {
            if (response.data.status === 'complete') {
                setPartners(response.data.data);
            }

            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query loading vendor options for the filter")
                console.error(response.data.message)
            }
        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        })
    }, [])

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/location/use`).then((response) => {
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
            Vendor: "",
            Location: "",
            start: "",
            end: ""
        })
        setRecords(intakeList)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = intakeList;

        if (filters.Vendor != "") {
            temp = temp.filter(f => f.Name == filters.Vendor);

        }

        if (filters.Location != "") {
            temp = temp.filter(f => f.Location == filters.Location);

        }

        if (filters.start != "" && filters.end == "") {
            temp = temp.filter(f => new Date(f.RecievedDate) >= new Date(filters.start))
        }
        if (filters.end != "" && filters.start == "") {
            temp = temp.filter(f => new Date(f.RecievedDate) <= new Date(filters.end))
        }
        if (filters.start != "" && filters.end != "") {
            temp = temp.filter(f => (new Date(f.RecievedDate) >= new Date(filters.start)) && (new Date(f.RecievedDate) <= new Date(filters.end)))
        }


        setRecords(temp);
    }

    if (records.length == 0) {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="Vendor">
                        Vendor
                        <select id="Vendor" name="Vendor" value={filters.Vendor} onChange={handleChange}>
                            <option value=""></option>
                            {partners.map((val) => {
                                return (
                                    <option value={val.Name}>{val.Name}</option>
                                )
                            })}

                        </select>

                    </label>

                    <label htmlFor="Location">
                        Location
                        <select id="Location" name="Location" value={filters.Location} onChange={handleChange}>
                            <option value=""></option>
                            {locations.map((val) => {
                                return (
                                    <option value={val.Name}>{val.Name}</option>
                                )
                            })}

                        </select>

                    </label>

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

                <button><Link to="/purchase/new">Add</Link></button>

                <table>
                    <thead>
                        <tr>
                            <th>Partner</th>
                            <th>Recieved Date</th>
                            <th>Total Items</th>
                            <th>Comments</th>
                            <th>Amount Spent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tfoot>
                        <tr>
                            <th>Total</th>
                        </tr>
                    </tfoot>
                </table>

                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Vendor">
                    Vendor
                    <select id="Vendor" name="Vendor" value={filters.Vendor} onChange={handleChange}>
                        <option value=""></option>
                        {partners.map((val) => {
                            return (
                                <option value={val.Name}>{val.Name}</option>
                            )
                        })}

                    </select>

                </label>

                <label htmlFor="Location">
                    Location
                    <select id="Location" name="Location" value={filters.Location} onChange={handleChange}>
                        <option value=""></option>
                        {locations.map((val) => {
                            return (
                                <option value={val.Name}>{val.Name}</option>
                            )
                        })}

                    </select>

                </label>

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

            <button><Link to="/purchase/new">Add</Link></button>

            <PurchasePosts posts={currentPosts} handleView={handleView} handleEdit={handleEdit} handleRemove={handleRemove} />
            <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />

            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );

    // return (
    //     <div>
    //         <Navbar />
    //         <h2>Purchases</h2>
    //         <React.Fragment>
    //             <Button variant="outlined" onClick={handleClickOpen}>
    //                 Filters</Button>
    //             <Dialog
    //                 open={open}
    //                 onClose={handleClose}
    //                 PaperProps={{
    //                     component: 'form',
    //                     onSubmit: (event) => {
    //                         event.preventDefault();
    //                         const formData = new FormData(event.currentTarget);
    //                         const formJson = Object.fromEntries(formData.entries());
    //                         const email = formJson.email;
    //                         console.log(email);
    //                         handleClose();
    //                     },
    //                 }}
    //             >
    //                 <DialogTitle>Filters</DialogTitle>
    //                 <DialogContent>
    //                     <form onSubmit={handleSubmit}>
    //                         <div className='vendor'>
    //                             <TextField
    //                                 id="outlined-select-vendor"
    //                                 select
    //                                 label="Vendor"
    //                                 defaultValue="Vendor"
    //                                 helperText="Please select a vendor"
    //                             >
    //                                 {partners.map((option) => (
    //                                     <MenuItem key={option.value} value={option.value}>
    //                                         {option.label}
    //                                     </MenuItem>
    //                                 ))}
    //                             </TextField>
    //                         </div>
    //                         <div className='location'>
    //                             <TextField
    //                                 id="outlined-select-location"
    //                                 select
    //                                 label="Location"
    //                                 defaultValue="Location"
    //                                 helperText="Please select a location"
    //                             >
    //                                 {locations.map((option) => (
    //                                     <MenuItem key={option.value} value={option.value}>
    //                                         {option.label}
    //                                     </MenuItem>
    //                                 ))}
    //                             </TextField>
    //                         </div>
    //                         <div className='date'>

    //                         </div>
    //                         <div className='submit'>
    //                             <DialogActions>
    //                                 <Button onClick={handleClose}>Cancel</Button>
    //                                 <Button type="submit">Submit</Button>
    //                             </DialogActions>
    //                         </div>
    //                     </form>
    //                 </DialogContent>
    //             </Dialog>
    //         </React.Fragment>

    //         <Button variant="contianed"><Link to="/purchase/new">Add</Link></Button>

    //         <PurchasePosts posts={currentPosts} handleView={handleView} handleEdit={handleEdit} handleRemove={handleRemove} />
    //         <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />
    //     </div>
    // );
}

export default Purchase;