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
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

function ProductDriveView() {
    const navigate = useNavigate();

    const [driveList, setDriveList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)


    const handleRemove = async (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the product drive list?`) == true) {
            let date = new Date().toLocaleDateString();
            try {
                await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/productdrive/remove/${id}`, { date: date }).then((response) => {

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
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the product drive list?`) == true) {
            try {
                await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/productdrive/reactivate/${id}`).then((response) => {

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

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/productdrive`).then((response) => {
            if (response.data.status == 'complete') {
                setDriveList(response.data.data);
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

    const handleView = (id) => {
        navigate(`/productdrive/${id}`)
    }

    const handleEdit = (id) => {
        navigate(`/productdrive/${id}/edit`)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = driveList;
        if (nonActive) {
            setRecords(temp)
        }

        else {
            setRecords(temp.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        }
    }


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

    //             <button><Link to="/productdrive/new">Add</Link></button>

    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Product Drive Name</th>
    //                         <th>Quantity of Items</th>
    //                         <th>Variety of Items</th>
    //                         <th>In-Kind Value</th>
    //                         <th>Actions</th>
    //                     </tr>
    //                 </thead>
    //             </table>
    //             <button><Link to="/Dashboard">Dasboard</Link></button>
    //         </div>
    //     )
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

    //             <button><Link to="/productdrive/new">Add</Link></button>

    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Product Drive Name</th>
    //                         <th>Quantity of Items</th>
    //                         <th>Variety of Items</th>
    //                         <th>In-Kind Value</th>
    //                         <th>Actions</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {records.map((val) => {
    //                         return (
    //                             <tr>
    //                                 <td>{val.Drive}</td>
    //                                 {val.Quantity == null ? <td>0</td>:<td>{val.Quantity}</td>}
    //                                 <td>{val.Variety}</td>
    //                                 {val.Total == null ? <td>0</td>:<td>{val.Total}</td>}
    //                                 <td>
    //                                     {typeof val.DeletedAt == "object" ? <button onClick={() => handleRemove(val.Partner_id, val.Drive)}>Delete</button> : <button onClick={() => handleReactivate(val.Partner_id, val.Drive)}>Reactivate</button>}
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
            <Button variant="contained"><Link to="/productdrive/new">Add</Link></Button>

            <table>
                <thead>
                    <tr>
                        <th>Product Drive Name</th>
                        <th>Quantity of Items</th>
                        <th>Variety of Items</th>
                        <th>In-Kind Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            </table>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                     <h3>{`Transfer from ${records.Taken} to ${records.Given} on ${records.Date}`}</h3>
                    </TableRow>
                    <TableRow>
                        <TableCell>Product Drive Name</TableCell>
                        <TableCell>Quanitiy of Items</TableCell>
                        <TableCell>Variety of Items</TableCell>
                        <TableCell>In-kind Value</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
            </Table>
            </TableContainer>
        </div>
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

                <Button variant="contained"><Link to="/productdrive/new">Add</Link></Button>
                <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                     <h3>{`Transfer from ${records.Taken} to ${records.Given} on ${records.Date}`}</h3>
                    </TableRow>
                    <TableRow>
                        <TableCell>Product Drive Name</TableCell>
                        <TableCell>Quanitiy of Items</TableCell>
                        <TableCell>Variety of Items</TableCell>
                        <TableCell>In-kind Value</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {records.map((val) => {
                            return (
                                <TableRow>
                                    <TableCell>{val.Drive}</TableCell>
                                    <TableCell>{val.Quantity}</TableCell>
                                    <TableCell>{val.Variety}</TableCell>
                                    <TableCell>{val.Total}</TableCell>
                                    <TableCell>
                                        {typeof val.DeletedAt == "object" ? <Button varaint="outlined" onClick={() => handleRemove(val.Partner_id, val.Name)}>Delete</Button> : <Button variant="outlined" onClick={() => handleReactivate(val.Partner_id, val.Name)}>Reactivate</Button>}
                                        <Button varaint="outlined" onClick={() => handleEdit(val.Partner_id)}>Edit</Button>
                                        <Button varaint="outlined" onClick={() => handleView(val.Partner_id)}>View</Button>
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

export default ProductDriveView;