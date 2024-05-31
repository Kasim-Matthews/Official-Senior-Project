import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Navbar from './components/navbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import Paper from '@mui/material/Paper';


function ItemView() {
    const navigate = useNavigate();

    const [itemList, setItemList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [tab2, setTab2] = React.useState([])
    const [locationList, setLocationList] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    useEffect(() => {
        Axios.get("http://localhost:3001/location/use").then((response) => {
            setLocationList(response.data);

        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3001/item").then((response) => {
            setItemList(response.data);
            setRecords(response.data.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3001/item/tab2").then((response) => {
            setTab2(response.data);
        })
    }, [])

    const handleRemove = (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the item list?`) == true) {
            let date = new Date().toLocaleDateString();
            Axios.put(`http://localhost:3001/item/remove/${id}`, { date: date });
            window.location.reload(false);
        }
    }

    const handleReactivate = (id, Name) => {
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the item list?`) == true) {
            Axios.put(`http://localhost:3001/item/reactivate/${id}`);
            window.location.reload(false);
        }
    }

    const handleEdit = (id) => {
        navigate(`/item/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/item/${id}`)
    }

    const row2 = tab2.reduce(function (rows, key, index) {
        return (index % 2 == 0 ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows;
    }, [])

    function handleSubmit(e){
        e.preventDefault();
        var temp = itemList;

        if(nonActive){
            setRecords(temp)
        }

        else{
            setRecords(temp.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        }
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
            <div style={{display: "flex"}}>

                <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                <label htmlFor="non-active" >Also include inactive items</label>

            </div>
            <input type="Submit"/>
            </form>
          </DialogContent>
        </Dialog>
      </React.Fragment>
            <Tabs>
                <TabList>
                    <Tab>tab 1</Tab>
                    <Tab>tab 2</Tab>
                </TabList>

                <TabPanel>
                    <Button variant="contained"><Link to="/item/new">Add</Link></Button>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Fair Market Value</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((val) => {
                        return (
                            <TableRow>
                                <TableCell onClick={() => handleView(val.Item_id)}>{val.Name}</TableCell>
                                <TableCell>${val.FairMarketValue}</TableCell>
                                <TableCell>
                                        {typeof (val.DeletedAt) == "object" ? <Button variant="outlined" onClick={() => handleRemove(val.Item_id, val.Name)}>Delete</Button> : <Button variaint="outlined" onClick={() => handleReactivate(val.Item_id, val.Name)}>Reactivate</Button>}
                                        <Button variant="outlined" onClick={() => handleEdit(val.Item_id)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            </TableContainer>
                </TabPanel>
                <TabPanel>
                    <Button variant="contained "><Link to="/item/new">Add</Link></Button>
                    <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        {locationList.map((val) => {
                                    return (
                                        <th>{val.Name}</th>
                                    )
                                })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {row2.map((val) => {
                        return (
                            <TableRow>
                                <TableCell>{val[0].Item}</TableCell>
                                {row2.map((val) => {
                                            return (
                                                <TableCell>{val.Quantity}</TableCell>
                                            )
                                        })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            </TableContainer>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default ItemView;