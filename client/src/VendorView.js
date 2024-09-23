import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Navbar from './components/navbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';


function VendorView() {

    const [vendorList, setVendorList] = useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)
    const navigate = useNavigate();

    const handleRemove = async (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the vendor list?`) == true) {
            let date = new Date().toLocaleDateString();
            try {
                await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/vendor/remove/${id}`, { date: date }).then((response) => {

                    if (response.status == 400) {
                        alert("Contact developer")
                    }

                    else if (response.status == 200) {
                        window.location.reload(false);
                    }
                })


            }
            catch (error) {
                alert("Server side error/Contact developer")
            }
        }

    }

    const handleReactivate = async (id, Name) => {
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the vendor list?`) == true) {
            try {
                await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/vendor/reactivate/${id}`).then((response) => {

                    if (response.status == 400) {
                        alert("Contact developer")
                    }

                    else if (response.status == 200) {
                        window.location.reload(false);
                    }
                })

            }
            catch (error) {
                alert("Server side error/Contact developer")
            }
        }
    }

    const handleEdit = (id) => {
        navigate(`/vendor/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/vendor/${id}`)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = vendorList;

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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/vendor`).then((response) => {
            if (response.data.status === 'complete') {
                setVendorList(response.data.data)
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

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // if (records.length == 0) {
    //     return (
    //         <div>
    //             <form onSubmit={handleSubmit}>
    //                 <div style={{ display: "flex" }}>

    //                     <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
    //                     <label htmlFor="non-active" >Also include inactive items</label>

    //                 </div>
    //                 <input type="Submit" />
    //             </form>
    //             <button><Link to="/vendor/new">Add</Link></button>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Business Name</th>
    //                         <th>Contact Name</th>
    //                         <th>Phone</th>
    //                         <th>Email</th>
    //                         <th>Actions</th>
    //                     </tr>
    //                 </thead>
    //             </table>
    //             <button><Link to="/Dashboard">Dasboard</Link></button>
    //         </div>
    //     );
    // }

    // else {
    //     return (
    //         <div>
    //             <form onSubmit={handleSubmit}>
    //                 <div style={{ display: "flex" }}>

    //                     <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
    //                     <label htmlFor="non-active" >Also include inactive items</label>

    //                 </div>
    //                 <input type="Submit" />
    //             </form>
    //             <button><Link to="/vendor/new">Add</Link></button>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Business Name</th>
    //                         <th>Contact Name</th>
    //                         <th>Phone</th>
    //                         <th>Email</th>
    //                         <th>Actions</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {records.map((val) => {
    //                         return (
    //                             <tr>
    //                                 <td>{val.Name}</td>
    //                                 <td>{val.Contact}</td>
    //                                 <td>{val.Phone}</td>
    //                                 <td>{val.Email}</td>
    //                                 <td>
    //                                     {typeof val.DeletedAt == "object" ? <button onClick={() => handleRemove(val.Partner_id, val.Name)}>Delete</button> : <button onClick={() => handleReactivate(val.Partner_id, val.Name)}>Reactivate</button>}
    //                                     <button onClick={() => handleEdit(val.Partner_id)}>Edit</button>
    //                                     <button onClick={() => handleView(val.Partner_id)}>View</button>
    //                                 </td>

    //                             </tr>
    //                         );
    //                     })}
    //                 </tbody>
    //             </table>
    //             <button><Link to="/Dashboard">Dasboard</Link></button>
    //         </div>
    //     );
    // }

    if (records.length == 0) {
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
                    <div style={{ display: "flex" }}>

                        <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                        <label htmlFor="non-active" >Also include inactive items</label>

                    </div>
                    <input type="Submit" />
                </form>
          </DialogContent>
        </Dialog>
      </React.Fragment>
                <Button varinat="contained"><Link to="/vendor/new">Add</Link></Button>
                <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Business Name</TableCell>
                        <TableCell>Contact Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
            </Table>
            </TableContainer>
            </div>
        );
    }

    else {
        return (
            <div>
                <Navbar />
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex" }}>

                        <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                        <label htmlFor="non-active" >Also include inactive items</label>

                    </div>
                    <input type="Submit" />
                </form>
                <Button variant="contained"><Link to="/vendor/new">Add</Link></Button>
                <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Business Name</TableCell>
                        <TableCell>Contact Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {records.map((val) => {
                            return (
                                <TableRow>
                                    <TableCell>{val.Name}</TableCell>
                                    <TableCell>{val.Contact}</TableCell>
                                    <TableCell>{val.Phone}</TableCell>
                                    <TableCell>{val.Email}</TableCell>
                                    <TableCell>
                                        {typeof val.DeletedAt == "object" ? <Button variant="outlined" onClick={() => handleRemove(val.Partner_id, val.Name)}>Delete</Button> : <Button variant="outlined" onClick={() => handleReactivate(val.Partner_id, val.Name)}>Reactivate</Button>}
                                        <Button varinat="outlined" onClick={() => handleEdit(val.Partner_id)}>Edit</Button>
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

export default VendorView;