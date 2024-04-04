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

function Intake(){
    const navigate = useNavigate();

    const [intakeList, setIntakeList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3306/intake").then((response) =>{
            setIntakeList(response.data);
        })
    }, [])




    /*const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3001/partner/remove/${id}`);
    }

    const handleEdit = (id) => {
        navigate(`/partner/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/partner/${id}`)
      }*/



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
                                    <button /*onClick={() => handleRemove(val.Partner_id)}*/>Delete</button>
                                    <button /*onClick={() => handleEdit(val.Partner_id)}*/>Edit</button>
                                    <button /*onClick={() => handleView(val.Partner_id)}*/>View</button>
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