import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, Link} from "react-router-dom";
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

function Intake(){
    const navigate = useNavigate();

    const [partners, setPartners] = React.useState([])
    const [locations, setLocations] = React.useState([])
    const [intakeList, setIntakeList] = React.useState([])
    const [records, setRecords] = React.useState([])

    const [filters, setFilters] = React.useState({
        PartnerType: 0,
        Location: "",

    })

    const [state, setState] = React.useState([{
        startDate: new Date(),
        endDate: addDays(new Date(), 30),
        key: 'selection'
    }])

    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(10);

    //Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = records.slice(indexOfFirstPost, indexOfLastPost)

    useEffect(() => {
        Axios.get("http://localhost:3306/intake").then((response) => {
            setIntakeList(response.data);
        })
    }, [])

    const paginate = pageNumber => setCurrentPage(pageNumber);




    const handleRemove = async (id) => {
        let GetData = async function (id) {
            return await Axios.get(`http://localhost:3306/intake/${id}/cleanup`).then((response) => {
                return response
            });
        }
        let data = GetData(id)
        data.then(async (response) => {
            await Axios.put("http://localhost:3306/intake/reclaim", { records: response.data })
        })

        await Axios.delete(`http://localhost:3306/intake/remove/${id}`);

        window.location.reload(false);


    }

    const handleEdit = (id) => {
        navigate(`/partner/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/intake/${id}`)
    }

    function handleChange(event) {
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = intakeList;

        if (filters.PartnerType != 0) {
            temp = temp.filter(f => f.Type == filters.PartnerType);
        }

        if (filters.Location != "") {
            temp = temp.filter(f => f.Location == filters.Location);
        }


        if (state != null) {
            temp = temp.filter(f => new Date(f.RecievedDate) >= state[0].startDate && new Date(f.RecievedDate) <= state[0].endDate)
        }


        setRecords(temp);
    }

    useEffect(() => {
        Axios.get("http://localhost:3306/partner/types").then((response) => {
          setPartners(response.data);
        })
      }, [])

    useEffect(() => {
        Axios.get("http://localhost:3306/location/use").then((response) => {
            setLocations(response.data);
        })
    }, [])


    return(
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ bgcolor: '#065AB0'}}>
                    <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/Dashboard" style={{ textDecoration: 'none', color: 'white' }}>{'Dashboard'}</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/distribution" style={{ textDecoration: 'none', color: 'white' }}>Distributions</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/intake" style={{ textDecoration: 'none', color: 'white' }}>Collections</Link>
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
            <button><Link to="/intake/new">Add</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>Partner</th>
                        <th>Value</th>
                        <th>Recieved Date</th>
                        <th>Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {intakeList.map((val) => {
                        let q = new Date(val.RecievedDate);
                        let monthRecievedDate= ""
                        let dayRecievedDate = ""
                        let yearRecievedDate = ""
                        let concatRecievedDate = ""
                        monthRecievedDate = q.getMonth()+ 1
                        dayRecievedDate = q.getDate() + 1
                        yearRecievedDate = q.getFullYear()+1
                        concatRecievedDate = yearRecievedDate + "-" + monthRecievedDate + "-" + dayRecievedDate
                        return(
                            
                            <tr>
                                <td>{val.Name}</td>
                                <td>{val.Value}</td>
                                <td>{concatRecievedDate}</td>
                                <td>{val.Comments}</td>
                                <td>
                                    <button onClick={() => handleRemove(val.Partner_id)}>Delete</button>
                                    <button onClick={() => handleEdit(val.Partner_id)}>Edit</button>
                                    <button onClick={() => handleView(val.Partner_id)}>View</button>
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default Intake;