import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";


function VendorView() {

    const [vendorList, setVendorList] = useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)
    const navigate = useNavigate();

    const handleRemove = async (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the vendor list?`) == true) {
            let date = new Date().toLocaleDateString();
            try {
                await Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/vendor/remove/${id}`, { date: date }).then((response) => {

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
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the vendor list?`) == true) {
            try {
                await Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/vendor/reactivate/${id}`).then((response) => {

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
        navigate(`/vendor/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/vendor/${id}`)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = vendorList;

        if (nonActive) {
            setRecords(temp)
        }

        else {
            setRecords(temp.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        }
    }

    useEffect(async () => {
        await Axios.get("https://diaper-bank-inventory-management-system.onrender.com/vendor").then((response) => {
            if (response.data.status === 'complete') {
                setVendorList(response.data.data)
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

    if (records.length == 0) {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex" }}>

                        <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                        <label htmlFor="non-active" >Also include inactive items</label>

                    </div>
                    <input type="Submit" />
                </form>
                <button><Link to="/vendor/new">Add</Link></button>
                <table>
                    <thead>
                        <tr>
                            <th>Business Name</th>
                            <th>Contact Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        );
    }

    else {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex" }}>

                        <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                        <label htmlFor="non-active" >Also include inactive items</label>

                    </div>
                    <input type="Submit" />
                </form>
                <button><Link to="/vendor/new">Add</Link></button>
                <table>
                    <thead>
                        <tr>
                            <th>Business Name</th>
                            <th>Contact Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((val) => {
                            return (
                                <tr>
                                    <td>{val.Name}</td>
                                    <td>{val.Contact}</td>
                                    <td>{val.Phone}</td>
                                    <td>{val.Email}</td>
                                    <td>
                                        {typeof val.DeletedAt == "object" ? <button onClick={() => handleRemove(val.Partner_id, val.Name)}>Delete</button> : <button onClick={() => handleReactivate(val.Partner_id, val.Name)}>Reactivate</button>}
                                        <button onClick={() => handleEdit(val.Partner_id)}>Edit</button>
                                        <button onClick={() => handleView(val.Partner_id)}>View</button>
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        );
    }
}

export default VendorView;