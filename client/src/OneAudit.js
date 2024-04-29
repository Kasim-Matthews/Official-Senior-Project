import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewAudit() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [date, setDate] = React.useState("")


    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/audit/${id}/view`).then((response) => {
            if (response.data.status === 'complete') {
                setRecord(response.data.data)
                setDate(response.data.data[0].Date)
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


    return (
        <div>
            <header>Audit was created on {new Date(date).toISOString().slice(0, 10)}</header>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Location</th>
                        <th>Previous Value</th>
                        <th>Changed Value</th>
                    </tr>
                </thead>
                <tbody>
                    {record.map((val) => {
                        if(val.Changed != null){
                            return (
                                <tr>
                                    <td>{val.Item}</td>
                                    <td>{val.Location}</td>
                                    <td>{val.Past}</td>
                                    <td>{val.Changed}</td>
                                </tr>
                            )
                        }

                        else{
                            return (
                                <tr>
                                    <td>{val.Item}</td>
                                    <td>{val.Location}</td>
                                    <td>{val.Past}</td>
                                    <td></td>
                                </tr>
                            )
                        }
                    })}
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    )
}


export default ViewAudit;