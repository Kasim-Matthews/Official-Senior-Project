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
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import TextField from "@mui/material/TextField";



function TransferView() {
    const navigate = useNavigate();

    const [partners, setPartners] = React.useState([])
    const [locations, setLocations] = React.useState([])
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const [transferList, setTransferList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [filters, setFilters] = React.useState({
        From: "",
        To: "",
        Date: ""

    })


    useEffect(() => {
        Axios.get("http://localhost:3001/transfer").then((response) => {
            setTransferList(response.data);
            setRecords(response.data);
        })
    }, [])

    const handleRemove = async (id, Name, Location) => {
        if (window.confirm(`Are you sure you want to delete ${Name}'s transfer from the transfer list?`) == true) {
            let GetData = async function (id) {
                return await Axios.get(`http://localhost:3001/transfer/${id}/cleanup`).then((response) => {
                    return response
                });
            }
            let data = GetData(id)
            data.then(async (response) => {
                await Axios.put("http://localhost:3001/transfer/reclaim", { records: response.data })
                await Axios.put("http://localhost:3001/transfer/renounce", { records: response.data, Location: Location })
            })

            await Axios.delete(`http://localhost:3001/intake/remove/${id}`);

            window.location.reload(false);
        }
    }

    const handleView = (id) => {
        navigate(`/transfer/${id}`)
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/transfer/adjustment").then((response) => {
            setPartners(response.data);
        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3001/location/use").then((response) => {
            setLocations(response.data);
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
            Date: ""
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


        if (filters.Date != "") {
            temp = temp.filter(f => new Date(f.Date) >= new Date(filters.Date))
        }


        setRecords(temp);
    }

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