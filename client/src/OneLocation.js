import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function ViewLocation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})
    const [list, setList] = React.useState([])
    const [outgoing, setOutgoing] = React.useState([])
    const [incoming, setIncoming] = React.useState([])

    useEffect(() => {
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/location/${id}/edit`).then((response) => {
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
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/location/${id}/tab1`).then((response) => {
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
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/location/${id}/tab2`).then((response) => {
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
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/location/${id}/tab3`).then((response) => {
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

    if (incoming.length == 0) {
        const listTotal = list.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
        const outgoingTotal = outgoing.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
        return (
            <div>
                <h2> Storage Location Info for {record.Name}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Storage Location</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{record.Name}</td>
                            <td>{record.Address}</td>
                        </tr>
                    </tbody>
                </table>
                <Tabs>
                    <TabList>
                        <Tab>Inventory</Tab>
                        <Tab>Inventory Going Out</Tab>
                        <Tab>Inventory Coming In</Tab>
                    </TabList>
                    <TabPanel>
                        <table>
                            <thead>
                                <th>Item</th>
                                <th>Quantity</th>
                            </thead>
    
                            <tbody>
                                {list.map((val) => {
                                    return (
                                        <tr>
                                            <td>{val.Item}</td>
                                            <td>{val.Quantity}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                    <td>{listTotal}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </TabPanel>
    
                    <TabPanel>
                        <table>
                            <thead>
                                <th>Item</th>
                                <th>Quantity</th>
                            </thead>
    
                            <tbody>
                                {outgoing.map((val) => {
                                    return (
                                        <tr>
                                            <td onClick={() => handleView(val.Item_id)}>{val.Item}</td>
                                            <td>{val.Quantity}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                    <td>{outgoingTotal}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </TabPanel>
    
                    <TabPanel>
                        <table>
                            <thead>
                                <th>Item</th>
                                <th>Quantity</th>
                            </thead>
    
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                </tr>
                            </tfoot>
                        </table>
                    </TabPanel>
                </Tabs>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }
    
    if (outgoing.length == 0) {
        const listTotal = list.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
        const incomingTotal = incoming.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
        return (
            <div>
                <h2> Storage Location Info for {record.Name}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Storage Location</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{record.Name}</td>
                            <td>{record.Address}</td>
                        </tr>
                    </tbody>
                </table>
                <Tabs>
                    <TabList>
                        <Tab>Inventory</Tab>
                        <Tab>Inventory Going Out</Tab>
                        <Tab>Inventory Coming In</Tab>
                    </TabList>
                    <TabPanel>
                        <table>
                            <thead>
                                <th>Item</th>
                                <th>Quantity</th>
                            </thead>
    
                            <tbody>
                                {list.map((val) => {
                                    return (
                                        <tr>
                                            <td>{val.Item}</td>
                                            <td>{val.Quantity}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                    <td>{listTotal}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </TabPanel>
    
                    <TabPanel>
                        <table>
                            <thead>
                                <th>Item</th>
                                <th>Quantity</th>
                            </thead>
    
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                </tr>
                            </tfoot>
                        </table>
                    </TabPanel>
    
                    <TabPanel>
                        <table>
                            <thead>
                                <th>Item</th>
                                <th>Quantity</th>
                            </thead>
    
                            <tbody>
                                {incoming.map((val) => {
                                    return (
                                        <tr>
                                            <td onClick={() => handleView(val.Item_id)}>{val.Item}</td>
                                            <td>{val.Quantity}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                    <td>{incomingTotal}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </TabPanel>
                </Tabs>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }
    
    if (incoming.length == 0 && outgoing.length == 0) {
        const listTotal = list.reduce((sum, val) => sum + parseInt(val.Quantity), 0);

        return (
            <div>
                <h2> Storage Location Info for {record.Name}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Storage Location</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{record.Name}</td>
                            <td>{record.Address}</td>
                        </tr>
                    </tbody>
                </table>
                <Tabs>
                    <TabList>
                        <Tab>Inventory</Tab>
                        <Tab>Inventory Going Out</Tab>
                        <Tab>Inventory Coming In</Tab>
                    </TabList>
                    <TabPanel>
                        <table>
                            <thead>
                                <th>Item</th>
                                <th>Quantity</th>
                            </thead>
    
                            <tbody>
                                {list.map((val) => {
                                    return (
                                        <tr>
                                            <td>{val.Item}</td>
                                            <td>{val.Quantity}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                    <td>{listTotal}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </TabPanel>
    
                    <TabPanel>
                        <table>
                            <thead>
                                <th>Item</th>
                                <th>Quantity</th>
                            </thead>
    
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                </tr>
                            </tfoot>
                        </table>
                    </TabPanel>
    
                    <TabPanel>
                        <table>
                            <thead>
                                <th>Item</th>
                                <th>Quantity</th>
                            </thead>
    
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                </tr>
                            </tfoot>
                        </table>
                    </TabPanel>
                </Tabs>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }
    
    
    
    
    const listTotal = list.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    const outgoingTotal = outgoing.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    const incomingTotal = incoming.reduce((sum, val) => sum + parseInt(val.Quantity), 0);
    return (
        <div>
            <h2> Storage Location Info for {record.Name}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Storage Location</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.Name}</td>
                        <td>{record.Address}</td>
                    </tr>
                </tbody>
            </table>
            <Tabs>
                <TabList>
                    <Tab>Inventory</Tab>
                    <Tab>Inventory Going Out</Tab>
                    <Tab>Inventory Coming In</Tab>
                </TabList>
                <TabPanel>
                    <table>
                        <thead>
                            <th>Item</th>
                            <th>Quantity</th>
                        </thead>

                        <tbody>
                            {list.map((val) => {
                                return (
                                    <tr>
                                        <td>{val.Item}</td>
                                        <td>{val.Quantity}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total</th>
                                <td>{listTotal}</td>
                            </tr>
                        </tfoot>
                    </table>
                </TabPanel>

                <TabPanel>
                    <table>
                        <thead>
                            <th>Item</th>
                            <th>Quantity</th>
                        </thead>

                        <tbody>
                            {outgoing.map((val) => {
                                return (
                                    <tr>
                                        <td onClick={() => handleView(val.Item_id)}>{val.Item}</td>
                                        <td>{val.Quantity}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total</th>
                                <td>{outgoingTotal}</td>
                            </tr>
                        </tfoot>
                    </table>
                </TabPanel>

                <TabPanel>
                    <table>
                        <thead>
                            <th>Item</th>
                            <th>Quantity</th>
                        </thead>

                        <tbody>
                            {incoming.map((val) => {
                                return (
                                    <tr>
                                        <td onClick={() => handleView(val.Item_id)}>{val.Item}</td>
                                        <td>{val.Quantity}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total</th>
                                <td>{incomingTotal}</td>
                            </tr>
                        </tfoot>
                    </table>
                </TabPanel>
            </Tabs>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    )
}

export default ViewLocation;