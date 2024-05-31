import React, { useEffect } from "react";
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
import { TableFooter } from '@mui/material';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

function LocationView() {
    const navigate = useNavigate();

    const [locationList, setLocationList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)

    useEffect(() => {
        Axios.get("http://localhost:3001/location").then((response) => {
            setLocationList(response.data);
            setRecords(response.data.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        })
    }, [])

    const handleRemove = (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the location list?`) == true) {
            let date = new Date().toLocaleDateString()
            Axios.put(`http://localhost:3001/location/remove/${id}`, { date: date });
            window.location.reload(false);
        }
    }

    const handleReactivate = (id, Name) => {
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the location list?`) == true) {
            Axios.put(`http://localhost:3001/location/reactivate/${id}`);
            window.location.reload(false);
        }
    }

    const handleEdit = (id) => {
        navigate(`/location/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/location/${id}`)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = locationList;

        if (nonActive) {
            setRecords(temp)
        }

        else {
            setRecords(temp.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        }
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

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
            <Button variant="contained"><Link to="/location/new">Add</Link></Button>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
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
                                    {typeof (val.DeletedAt) == "object" ? <Button variant="outlined" onClick={() => handleRemove(val.Location_id, val.Name)}>Delete</Button> : <Button varaint="outlined" onClick={() => handleReactivate(val.Location_id, val.Name)}>Reactivate</Button>}
                                    <Button variant="outlined" onClick={() => handleEdit(val.Location_id)}>Edit</Button>
                                    <Button variant="outlined" onClick={() => handleView(val.Location_id)}>View</Button>
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

export default LocationView;