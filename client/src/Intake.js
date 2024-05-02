import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import IntakePosts from "./components/IntakePosts";
import Pagination from "./components/Pagination";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { te } from "date-fns/locale";

function Intake() {
    const navigate = useNavigate();

    const [partners, setPartners] = React.useState([])
    const [locations, setLocations] = React.useState([])
    const [intakeList, setIntakeList] = React.useState([])
    const [records, setRecords] = React.useState([])

    const [filters, setFilters] = React.useState({
        PartnerType: 0,
        Location: "",
        Date: ""
    })



    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(10);

    //Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = records.slice(indexOfFirstPost, indexOfLastPost)

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/donation`).then((response) => {
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
        if (window.confirm(`Are you sure you want to delete this donation from ${Name}?`) == true) {
            try {
                const response = await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/donation/reclaim`, { id: id })

                if(response.data.status == 409){
                    console.log(response.data)
                    alert(`These items: ${response.data.data} quantities are lower than what you want to take away`)
                }

                else if (response.status == 400) {
                    alert("Contact developer")
                }

                // else if (response.status == 200) {
                //     window.location.reload(false);
                // }
            }

            catch (error) {
                console.log(error)
                alert("Server side error/Contact developer")
            }
        }


    }

    const handleEdit = (id) => {
        navigate(`/donation/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/donation/${id}`)
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
            PartnerType: 0,
            Location: "",
            Date: ""
        })
        setRecords(intakeList)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = intakeList;

        if (filters.PartnerType != 0) {
            temp = temp.filter(f => f.Type_id == filters.PartnerType);
        }

        if (filters.Location != "") {
            temp = temp.filter(f => f.Location == filters.Location);
        }


        if (filters.Date != "") {
            temp = temp.filter(f => new Date(f.RecievedDate) >= new Date(filters.Date))
        }


        setRecords(temp);
    }

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/partner/types`).then((response) => {
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


    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ bgcolor: '#065AB0' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/Dashboard" style={{ textDecoration: 'none', color: 'white' }}>{'Dashboard'}</Link>
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/distribution" style={{ textDecoration: 'none', color: 'white' }}>Distributions</Link>
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/donation" style={{ textDecoration: 'none', color: 'white' }}>Collections</Link>
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="#" style={{ textDecoration: 'none', color: 'white' }}>Inventory</Link>
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/partner" style={{ textDecoration: 'none', color: 'white' }}>Partner</Link>
                        </Typography>
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>

            <form onSubmit={handleSubmit}>
                <label htmlFor="PartnerType">
                    Partner
                    <select id="PartnerType" name="PartnerType" value={filters.PartnerType} onChange={handleChange}>
                        <option value=""></option>
                        {partners.map((val) => {
                            return (
                                <option value={val.PartnerType_id}>{val.Type}</option>
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
                    <input type="date" name="Date" value={filters.Date} onChange={handleChange} />
                </label>



                <input type="submit" value="Filter" />
                <button onClick={clearFilters}>Clear</button>



            </form>


            <button><Link to="/donation/new">Add</Link></button>

            <IntakePosts posts={currentPosts} handleView={handleView} handleEdit={handleEdit} handleRemove={handleRemove} />
            <Pagination postsPerPage={postsPerPage} totalPosts={records.length} paginate={paginate} />
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default Intake;