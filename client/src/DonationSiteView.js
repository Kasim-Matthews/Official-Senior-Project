import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";


function DonationSiteView() {

    const [dsiteList, setDsiteList] = useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)
    const navigate = useNavigate();

    const handleRemove = (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the donation site list?`) == true) {
            let date = new Date().toLocaleDateString();
            Axios.put(`http://localhost:3306/donationsite/remove/${id}`, { date: date });
            window.location.reload(false);
        }

    }

    const handleReactivate = (id, Name) => {
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the donation site list?`) == true) {
            Axios.put(`http://localhost:3001/donationsite/reactivate/${id}`);
            window.location.reload(false);
        }
    }

    const handleEdit = (id) => {
        navigate(`/donationsite/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/donationsite/${id}`)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = dsiteList;

        if (nonActive) {
            setRecords(temp)
        }

        else {
            setRecords(temp.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        }
    }

    useEffect(() => {
        Axios.get("http://localhost:3306/donationsite").then((response) => {
            if (response.data.status === 'complete') {
                setDsiteList(response.data.data)
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


    if (records.length === 0) {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex" }}>

                        <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                        <label htmlFor="non-active" >Also include inactive items</label>

                    </div>
                    <input type="Submit" />
                </form>
                <button><Link to="/donationsite/new">Add</Link></button>
                <table>
                    <thead>
                        <tr>
                            <th>Donation Site</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
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
                <button><Link to="/donationsite/new">Add</Link></button>
                <table>
                    <thead>
                        <tr>
                            <th>Donation Site</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((val) => {
                            return (
                                <tr>
                                    <td>{val.Name}</td>
                                    <td>{val.Address}</td>
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

export default DonationSiteView;