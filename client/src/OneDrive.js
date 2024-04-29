import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from './components/navbar';

function ViewDrive() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})
    const [intakeList, setIntakeList] = React.useState([])

    const handleView = (id) => {
        navigate(`/intake/${id}`)
    }


    useEffect(() => {
        Axios.get(`http://localhost:3001/productdrive/${id}/edit`).then((response) => {
            if (response.data.status === 'complete') {
                setRecord(response.data.data[0])
            }

            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query")
                console.error(response.data.message)
            }
        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        });
    }, [])

    useEffect(() => {
        Axios.get(`http://localhost:3001/productdrive/${id}/view`).then((response) => {
            if (response.data.status === 'complete') {
                setIntakeList(response.data.data)
            }

            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query")
                console.error(response.data.message)
            }

        }).catch(error => {
            navigate('/error')
            console.error(error.response.data.message)
        });
    }, [])


    if (intakeList.length === 0) {
        return (
            <div>
                <Navbar />
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{record.Name}</td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Quantity</th>
                            <th>Total Items</th>
                            <th>Details</th>
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
                <Navbar />
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{record.Name}</td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Quantity</th>
                            <th>Total Items</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {intakeList.map((val) => {
                            return (
                                <tr>
                                    <td>{val.Location}</td>
                                    <td>{val.Quantity}</td>
                                    <td>{val.TotalItems}</td>
                                    <td>
                                        <button onClick={() => handleView(val.Intake_id)}>View Details</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }

}
/*Cannot edit till the purchase functionality is a thing*/

export default ViewDrive;