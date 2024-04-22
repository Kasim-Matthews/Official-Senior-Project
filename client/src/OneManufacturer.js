import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewManufacturer() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [manuList, setManuList] = React.useState([])


    useEffect(() => {
        Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/manufacturers/${id}/view`).then((response) => {
            console.log(response.data.status)
            console.log(response.data.data)
            if (response.data.status === 'complete') {
                setRecord(response.data.data)
                console.log(response.data.data)
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
        Axios.get("https://diaper-bank-inventory-management-system.onrender.com/manufacturers").then((response) => {
            if (response.data.status === 'complete') {
                setManuList(response.data.data);
            }

            else if (response.data.status === 'error in query') {
                navigate('/query')
                console.error("Fail in the query")
                console.error(response.data.message)
            }
        }).catch(error => {
            navigate('/error')
            console.error(error)
        })
    }, [])

    console.log(manuList)

    const handleView = (id) => {
        navigate(`/intake/${id}`)
    }

    if (record.length === 1) {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <h3>Past Donations from {record[0].Date}</h3>
                        </tr>
                        <tr>
                            <th>Date</th>
                            <th>Volume</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {record.map((val) => {
                            return (
                                <tr>
                                    <td>{val.Date}</td>
                                    <td>{val.Volume}</td>
                                    <td><button onClick={() => handleView(val.Intake_id)}> View donation details</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }
    else {
        return (
            <div>

                <table>
                    <thead>
                        <tr>
                            <h3>{`Past Donations from ${record[0].Manufacturer}`}</h3>
                        </tr>
                        <tr>
                            <th>Date</th>
                            <th>Volume</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {record.map((val) => {
                            return (
                                <tr>
                                    <td>{val.Date}</td>
                                    <td>{val.Volume}</td>
                                    <td><button onClick={() => handleView(val.Intake_id)}> View donation details</button></td>
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

export default ViewManufacturer;