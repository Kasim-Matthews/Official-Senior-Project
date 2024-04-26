import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function LocationView() {
    const navigate = useNavigate();

    const [locationList, setLocationList] = React.useState([])
    const [records, setRecords] = React.useState([])
    const [nonActive, setNonActive] = React.useState(false)

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/location`).then((response) => {
            
            if (response.data.status === 'complete') {
                setLocationList(response.data.data);
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

    const handleRemove = async (id, Name) => {
        if (window.confirm(`Are you sure you want to delete ${Name} from the location list?`) == true) {
            let date = new Date().toLocaleDateString()
            
            try {
                await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/location/remove/${id}`, { date: date }).then((response) => {

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
        if (window.confirm(`Are you sure you want to reactivate ${Name} from the location list?`) == true) {
            
            try {
                await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/location/reactivate/${id}`).then((response) => {

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