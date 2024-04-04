import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function ItemView() {
    const navigate = useNavigate();

    const [itemList, setItemList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [tab2, setTab2] = React.useState([])
    const [locationList, setLocationList] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)

    useEffect(() => {
        Axios.get("http://localhost:3001/location/use").then((response) => {
            setLocationList(response.data);

        })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:3306/item").then((response) => {
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
            Axios.put(`http://localhost:3306/item/remove/${id}`, { date: date });
            window.location.reload(false);
        }
    }

    const handleReactivate = (id, Name) => {
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the item list?`) == true) {
            Axios.put(`http://localhost:3306/item/reactivate/${id}`);
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
            <form onSubmit={handleSubmit}>
                <div style={{display: "flex"}}>

                    <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                    <label htmlFor="non-active" >Also include inactive items</label>

                </div>
                <input type="Submit"/>
            </form>
            <Tabs>
                <TabList>
                    <Tab>tab 1</Tab>
                    <Tab>tab 2</Tab>
                </TabList>

                <TabPanel>
                    <button><Link to="/item/new">Add</Link></button>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>FairMarketValue</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((val) => {
                                return (
                                    <tr>
                                        <td onClick={() => handleView(val.Item_id)}>{val.Name}</td>
                                        <td>${val.FairMarketValue}</td>
                                        <td>
                                            {typeof (val.DeletedAt) == "object" ? <button onClick={() => handleRemove(val.Item_id, val.Name)}>Delete</button> : <button onClick={() => handleReactivate(val.Item_id, val.Name)}>Reactivate</button>}
                                            <button onClick={() => handleEdit(val.Item_id)}>Edit</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </TabPanel>
                <TabPanel>
                    <button><Link to="/item/new">Add</Link></button>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                {locationList.map((val) => {
                                    return (
                                        <th>{val.Name}</th>
                                    )
                                })}
                            </tr>
                        </thead>

                        <tbody>
                            {row2.map((row) => {
                                return (
                                    <tr>
                                        <td>{row[0].Item}</td>
                                        {row.map((val) => {
                                            return (
                                                <td>{val.Quantity}</td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </TabPanel>
            </Tabs>

            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default ItemView;