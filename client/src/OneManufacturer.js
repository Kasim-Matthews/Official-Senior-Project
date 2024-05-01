import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewManufacturer() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [intakeList, setIntakeList] = React.useState([])


    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/manufacturers/${id}/edit`).then((response) => {
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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/manufacturers/${id}/view`).then((response) => {
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
        })
    }, [])

    const handleView = (id) => {
        navigate(`/donation/${id}`)
    }

    if (intakeList.length === 0) {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <h3>Past Donations from {record.Name}</h3>
                        </tr>
                        <tr>
                            <th>Date</th>
                            <th>Volume</th>
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

                <table>
                    <thead>
                        <tr>
                            <h3>Past Donations from {record.Name}</h3>
                        </tr>
                        <tr>
                            <th>Date</th>
                            <th>Volume</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {intakeList.map((val) => {
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