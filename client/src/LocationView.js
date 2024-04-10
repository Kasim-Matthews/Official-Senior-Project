import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function LocationView() {
    const navigate = useNavigate();

    const [locationList, setLocationList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)

    useEffect(() => {
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/location").then((response) => {
            setLocationList(response.data);
            setRecords(response.data.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        })
    }, [])

    const handleRemove = (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the location list?`) == true) {
            let date = new Date().toLocaleDateString()
            Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/location/remove/${id}`, { date: date });
            window.location.reload(false);
        }
    }

    const handleReactivate = (id, Name) => {
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the location list?`) == true) {
            Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/location/reactivate/${id}`);
            window.location.reload(false);
        }
    }

    const handleEdit = (id) => {
        navigate(`/location/${id}/edit`)
    }

    const handleView = (id) => {
        navigate(`/location/${id}`)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var temp = locationList;

        if (nonActive) {
            setRecords(temp)
        }

        else {
            setRecords(temp.filter(function (currentObject) {
                return typeof (currentObject.DeletedAt) == "object";
            }))
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: "flex" }}>

                    <input type="checkbox" id="non-active" name="non-active" onChange={() => setNonActive(!nonActive)} />
                    <label htmlFor="non-active" >Also include inactive items</label>

                </div>
                <input type="Submit" />
            </form>
            <button><Link to="/location/new">Add</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
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
                                {typeof (val.DeletedAt) == "object" ? <button onClick={() => handleRemove(val.Location_id, val.Name)}>Delete</button> : <button onClick={() => handleReactivate(val.Location_id, val.Name)}>Reactivate</button>}
                                    <button onClick={() => handleEdit(val.Location_id)}>Edit</button>
                                    <button onClick={() => handleView(val.Location_id)}>View</button>
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

export default LocationView;