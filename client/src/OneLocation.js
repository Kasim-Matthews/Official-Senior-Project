import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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

function ViewLocation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})
    const [list, setList] = React.useState([])
    const [outgoing, setOutgoing] = React.useState([])
    const [incoming, setIncoming] = React.useState([])

    useEffect(() => {
        Axios.get(`http://localhost:3001/location/${id}/edit`).then((response) => {
            response.data.map((key, value) => { setRecord(key) });
        })
    }, [])

    useEffect(() => {
        Axios.get(`http://localhost:3001/location/${id}/tab1`).then((response) => {
            setList(response.data)
        })
    }, [])

    useEffect(() => {
        Axios.get(`http://localhost:3001/location/${id}/tab2`).then((response) => {
            setOutgoing(response.data)
        })
    }, [])

    useEffect(() => {
        Axios.get(`http://localhost:3001/location/${id}/tab3`).then((response) => {
            setIncoming(response.data)
        })
    }, [])

    const handleView = (id) => {
        navigate(`/item/${id}`)
    }

    const listTotal = list.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    const outgoingTotal = outgoing.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    const incomingTotal = incoming.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    return (
        <div>
            <Navbar />
            <h2> Storage Location Info for {record.Name}</h2>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell>Storage Location</TableCell>
                      <TableCell>Address</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>{record.Name}</TableCell>
                        <TableCell>{record.Address}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </TableContainer>
            <Tabs>
                <TabList>
                    <Tab>Inventory</Tab>
                    <Tab>Inventory Going Out</Tab>
                    <Tab>Inventory Coming In</Tab>
                </TabList>
                <TabPanel>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((val) => {
                        return (
                            <TableRow>
                                <TableCell>{record.Item}</TableCell>
                                <TableCell>{record.Quantity}</TableCell>
                            </TableRow>
                      )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>{listTotal}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            </TableContainer>
                </TabPanel>

                <TabPanel>
                    <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {outgoing.map((val) => {
                                return (
                                    <TableRow>
                                        <TableCell onClick={() => handleView(val.Item_id)}>{val.Item}</TableCell>
                                        <TableCell>{val.Quantity}</TableCell>
                                    </TableRow>
                                )
                            })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>{outgoingTotal}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            </TableContainer>
                </TabPanel>

                <TabPanel>
                    <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {incoming.map((val) => {
                                return (
                                    <TableRow>
                                        <TableCell onClick={() => handleView(val.Item_id)}>{val.Item}</TableCell>
                                        <TableCell>{val.Quantity}</TableCell>
                                    </TableRow>
                                )
                            })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>{incomingTotal}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            </TableContainer>
                </TabPanel>
            </Tabs>
        </div>
    )
}

export default ViewLocation;