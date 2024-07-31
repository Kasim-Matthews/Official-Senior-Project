import React, { useEffect } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, Link } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Button from '@mui/material/Button';
import Navbar from "./components/navbar";

function AdminDashboard() {
    const navigate = useNavigate();

    const axiosPrivate = useAxiosPrivate();

    const [userList, setUserList] = React.useState([])

    useEffect(() => {
        axiosPrivate.get("http://localhost:3001/admin").then((response) => {
            setUserList(response.data.data);
        })
    })

    const handleRemove = (user, id) => {
        if (window.confirm(`Are you sure you want to delete ${user} account?`) == true) {
            axiosPrivate.delete(`http://localhost:3001/admin/remove/${id}`);
            navigate('/admin')
        }


    }



    return (
        <div>
            <Navbar />
            <Button variant="contained"><Link to="/user/new">Create User</Link></Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>UserName</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((val) => {
                            return (
                                <TableRow>
                                    <TableCell>{val.Username}</TableCell>
                                    <TableCell>{val.Role}</TableCell>
                                    <TableCell>
                                        <Button varaint="outlined" onClick={() => handleRemove(val.Username, val.User_id)}>Delete</Button>
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

export default AdminDashboard;