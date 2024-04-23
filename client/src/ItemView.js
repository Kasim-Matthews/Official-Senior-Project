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
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/location/use").then((response) => {
            setLocationList(response.data.data);

        })
    }, [])

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/item").then((response) => {
            if (response.data.status === 'complete') {
                setItemList(response.data.data);
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

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/item/tab2").then((response) => {
            if (response.data.status === 'complete') {
                setTab2(response.data.data);
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

    const handleRemove = async (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the item list?`) == true) {
            let date = new Date().toLocaleDateString();
            try {
                await Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/item/remove/${id}`, { date: date }).then((response) => {

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
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the item list?`) == true) {
            try {
                await Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/item/reactivate/${id}`).then((response) => {

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
        navigate(`/item/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/item/${id}`)
    }



    function handleSubmit(e) {
        e.preventDefault();
        var temp = itemList;

        if (nonActive) {
            setRecords(temp)
        }

        else {
            setRecords(temp.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        }
    }
    console.log(tab2)

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: "flex" }}>

                    <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                    <label htmlFor="non-active" >Also include inactive items</label>

                </div>
                <input type="Submit" />
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

                        </tbody>
                    </table>
                </TabPanel>
            </Tabs>

            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default ItemView;