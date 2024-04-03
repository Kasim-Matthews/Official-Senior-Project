import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function ViewLocation(){
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
                                return(
                                    <tr>
                                        <td>{val.Item}</td>
                                        <td>{val.Quantity}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
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
                                return(
                                    <tr>
                                        <td onClick={() => handleView(val.Item_id)}>{val.Item}</td>
                                        <td>{val.Quantity}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
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
                                return(
                                    <tr>
                                        <td onClick={() => handleView(val.Item_id)}>{val.Item}</td>
                                        <td>{val.Quantity}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </TabPanel>
            </Tabs>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    )
}

export default ViewLocation;