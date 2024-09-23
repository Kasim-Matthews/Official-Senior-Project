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

function ViewLocation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})
    const [list, setList] = React.useState([])
    const [outgoing, setOutgoing] = React.useState([])
    const [incoming, setIncoming] = React.useState([])

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/location/${id}/edit`).then((response) => {
            if (response.data.status === 'complete') {
                response.data.data.map((key, value) => { setRecord(key) });
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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/location/${id}/tab1`).then((response) => {
            if (response.data.status === 'complete') {
                setList(response.data.data)
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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/location/${id}/tab2`).then((response) => {
            if (response.data.status === 'complete') {
                setOutgoing(response.data.data)
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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/location/${id}/tab3`).then((response) => {
            if (response.data.status === 'complete') {
                setIncoming(response.data.data)
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
        navigate(`/item/${id}`)
    }

    // if (incoming.length == 0) {
    //     const listTotal = list.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    //     const outgoingTotal = outgoing.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    //     return (
    //         <div>
    //             <h2> Storage Location Info for {record.Name}</h2>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Storage Location</th>
    //                         <th>Address</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     <tr>
    //                         <td>{record.Name}</td>
    //                         <td>{record.Address}</td>
    //                     </tr>
    //                 </tbody>
    //             </table>
    //             <Tabs>
    //                 <TabList>
    //                     <Tab>Inventory</Tab>
    //                     <Tab>Inventory Going Out</Tab>
    //                     <Tab>Inventory Coming In</Tab>
    //                 </TabList>
    //                 <TabPanel>
    //                     <table>
    //                         <thead>
    //                             <th>Item</th>
    //                             <th>Quantity</th>
    //                         </thead>
    
    //                         <tbody>
    //                             {list.map((val) => {
    //                                 return (
    //                                     <tr>
    //                                         <td>{val.Item}</td>
    //                                         <td>{val.Quantity}</td>
    //                                     </tr>
    //                                 )
    //                             })}
    //                         </tbody>
    //                         <tfoot>
    //                             <tr>
    //                                 <th>Total</th>
    //                                 <td>{listTotal}</td>
    //                             </tr>
    //                         </tfoot>
    //                     </table>
    //                 </TabPanel>
    
    //                 <TabPanel>
    //                     <table>
    //                         <thead>
    //                             <th>Item</th>
    //                             <th>Quantity</th>
    //                         </thead>
    
    //                         <tbody>
    //                             {outgoing.map((val) => {
    //                                 return (
    //                                     <tr>
    //                                         <td onClick={() => handleView(val.Item_id)}>{val.Item}</td>
    //                                         <td>{val.Quantity}</td>
    //                                     </tr>
    //                                 )
    //                             })}
    //                         </tbody>
    //                         <tfoot>
    //                             <tr>
    //                                 <th>Total</th>
    //                                 <td>{outgoingTotal}</td>
    //                             </tr>
    //                         </tfoot>
    //                     </table>
    //                 </TabPanel>
    
    //                 <TabPanel>
    //                     <table>
    //                         <thead>
    //                             <th>Item</th>
    //                             <th>Quantity</th>
    //                         </thead>
    
    //                         <tfoot>
    //                             <tr>
    //                                 <th>Total</th>
    //                             </tr>
    //                         </tfoot>
    //                     </table>
    //                 </TabPanel>
    //             </Tabs>
    //             <button><Link to="/Dashboard">Dasboard</Link></button>
    //         </div>
    //     )
    // }
    
    // if (outgoing.length == 0) {
    //     const listTotal = list.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    //     const incomingTotal = incoming.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    //     return (
    //         <div>
    //             <h2> Storage Location Info for {record.Name}</h2>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Storage Location</th>
    //                         <th>Address</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     <tr>
    //                         <td>{record.Name}</td>
    //                         <td>{record.Address}</td>
    //                     </tr>
    //                 </tbody>
    //             </table>
    //             <Tabs>
    //                 <TabList>
    //                     <Tab>Inventory</Tab>
    //                     <Tab>Inventory Going Out</Tab>
    //                     <Tab>Inventory Coming In</Tab>
    //                 </TabList>
    //                 <TabPanel>
    //                     <table>
    //                         <thead>
    //                             <th>Item</th>
    //                             <th>Quantity</th>
    //                         </thead>
    
    //                         <tbody>
    //                             {list.map((val) => {
    //                                 return (
    //                                     <tr>
    //                                         <td>{val.Item}</td>
    //                                         <td>{val.Quantity}</td>
    //                                     </tr>
    //                                 )
    //                             })}
    //                         </tbody>
    //                         <tfoot>
    //                             <tr>
    //                                 <th>Total</th>
    //                                 <td>{listTotal}</td>
    //                             </tr>
    //                         </tfoot>
    //                     </table>
    //                 </TabPanel>
    
    //                 <TabPanel>
    //                     <table>
    //                         <thead>
    //                             <th>Item</th>
    //                             <th>Quantity</th>
    //                         </thead>
    
    //                         <tfoot>
    //                             <tr>
    //                                 <th>Total</th>
    //                             </tr>
    //                         </tfoot>
    //                     </table>
    //                 </TabPanel>
    
    //                 <TabPanel>
    //                     <table>
    //                         <thead>
    //                             <th>Item</th>
    //                             <th>Quantity</th>
    //                         </thead>
    
    //                         <tbody>
    //                             {incoming.map((val) => {
    //                                 return (
    //                                     <tr>
    //                                         <td onClick={() => handleView(val.Item_id)}>{val.Item}</td>
    //                                         <td>{val.Quantity}</td>
    //                                     </tr>
    //                                 )
    //                             })}
    //                         </tbody>
    //                         <tfoot>
    //                             <tr>
    //                                 <th>Total</th>
    //                                 <td>{incomingTotal}</td>
    //                             </tr>
    //                         </tfoot>
    //                     </table>
    //                 </TabPanel>
    //             </Tabs>
    //             <button><Link to="/Dashboard">Dasboard</Link></button>
    //         </div>
    //     )
    // }
    
    // if (incoming.length == 0 && outgoing.length == 0) {
    //     const listTotal = list.reduce((sum, val) => sum + parseInt(val.Quantity), 0);

    //     return (
    //         <div>
    //             <h2> Storage Location Info for {record.Name}</h2>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>Storage Location</th>
    //                         <th>Address</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     <tr>
    //                         <td>{record.Name}</td>
    //                         <td>{record.Address}</td>
    //                     </tr>
    //                 </tbody>
    //             </table>
    //             <Tabs>
    //                 <TabList>
    //                     <Tab>Inventory</Tab>
    //                     <Tab>Inventory Going Out</Tab>
    //                     <Tab>Inventory Coming In</Tab>
    //                 </TabList>
    //                 <TabPanel>
    //                     <table>
    //                         <thead>
    //                             <th>Item</th>
    //                             <th>Quantity</th>
    //                         </thead>
    
    //                         <tbody>
    //                             {list.map((val) => {
    //                                 return (
    //                                     <tr>
    //                                         <td>{val.Item}</td>
    //                                         <td>{val.Quantity}</td>
    //                                     </tr>
    //                                 )
    //                             })}
    //                         </tbody>
    //                         <tfoot>
    //                             <tr>
    //                                 <th>Total</th>
    //                                 <td>{listTotal}</td>
    //                             </tr>
    //                         </tfoot>
    //                     </table>
    //                 </TabPanel>
    
    //                 <TabPanel>
    //                     <table>
    //                         <thead>
    //                             <th>Item</th>
    //                             <th>Quantity</th>
    //                         </thead>
    
    //                         <tfoot>
    //                             <tr>
    //                                 <th>Total</th>
    //                             </tr>
    //                         </tfoot>
    //                     </table>
    //                 </TabPanel>
    
    //                 <TabPanel>
    //                     <table>
    //                         <thead>
    //                             <th>Item</th>
    //                             <th>Quantity</th>
    //                         </thead>
    
    //                         <tfoot>
    //                             <tr>
    //                                 <th>Total</th>
    //                             </tr>
    //                         </tfoot>
    //                     </table>
    //                 </TabPanel>
    //             </Tabs>
    //             <button><Link to="/Dashboard">Dasboard</Link></button>
    //         </div>
    //     )
    // }
    
    
    
    
    const listTotal = list.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    const outgoingTotal = outgoing.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    const incomingTotal = incoming.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    // return (
    //     <div>
    //         <h2> Storage Location Info for {record.Name}</h2>
    //         <table>
    //             <thead>
    //                 <tr>
    //                     <th>Storage Location</th>
    //                     <th>Address</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 <tr>
    //                     <td>{record.Name}</td>
    //                     <td>{record.Address}</td>
    //                 </tr>
    //             </tbody>
    //         </table>
    //         <Tabs>
    //             <TabList>
    //                 <Tab>Inventory</Tab>
    //                 <Tab>Inventory Going Out</Tab>
    //                 <Tab>Inventory Coming In</Tab>
    //             </TabList>
    //             <TabPanel>
    //                 <table>
    //                     <thead>
    //                         <th>Item</th>
    //                         <th>Quantity</th>
    //                     </thead>

    //                     <tbody>
    //                         {list.map((val) => {
    //                             return (
    //                                 <tr>
    //                                     <td>{val.Item}</td>
    //                                     <td>{val.Quantity}</td>
    //                                 </tr>
    //                             )
    //                         })}
    //                     </tbody>
    //                     <tfoot>
    //                         <tr>
    //                             <th>Total</th>
    //                             <td>{listTotal}</td>
    //                         </tr>
    //                     </tfoot>
    //                 </table>
    //             </TabPanel>

    //             <TabPanel>
    //                 <table>
    //                     <thead>
    //                         <th>Item</th>
    //                         <th>Quantity</th>
    //                     </thead>

    //                     <tbody>
    //                         {outgoing.map((val) => {
    //                             return (
    //                                 <tr>
    //                                     <td onClick={() => handleView(val.Item_id)}>{val.Item}</td>
    //                                     <td>{val.Quantity}</td>
    //                                 </tr>
    //                             )
    //                         })}
    //                     </tbody>
    //                     <tfoot>
    //                         <tr>
    //                             <th>Total</th>
    //                             <td>{outgoingTotal}</td>
    //                         </tr>
    //                     </tfoot>
    //                 </table>
    //             </TabPanel>

    //             <TabPanel>
    //                 <table>
    //                     <thead>
    //                         <th>Item</th>
    //                         <th>Quantity</th>
    //                     </thead>

    //                     <tbody>
    //                         {incoming.map((val) => {
    //                             return (
    //                                 <tr>
    //                                     <td onClick={() => handleView(val.Item_id)}>{val.Item}</td>
    //                                     <td>{val.Quantity}</td>
    //                                 </tr>
    //                             )
    //                         })}
    //                     </tbody>
    //                     <tfoot>
    //                         <tr>
    //                             <th>Total</th>
    //                             <td>{incomingTotal}</td>
    //                         </tr>
    //                     </tfoot>
    //                 </table>
    //             </TabPanel>
    //         </Tabs>
    //         <button><Link to="/Dashboard">Dasboard</Link></button>
    //     </div>
    // )

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