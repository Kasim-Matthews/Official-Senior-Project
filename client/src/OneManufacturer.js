import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewManufacturer() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])


    useEffect(() => {
        console.log("useEffect called");
        const getrows = async () => {
            try {
                const res = await Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/manufacturers/${id}/view`)
                if (res.data.status === 'complete') {
                    setRecord(res.data.data)
                    console.log(res.data.data)
                }

                else if (res.data.status === 'error in query') {
                    navigate('/query')
                    console.error("Fail in the query")
                    console.error(res.data.message)
                }
            }

            catch (error) {
                navigate('/error')
                console.error(error.response.data.message)
            }
        }
        getrows();
    }, [])

useEffect(() => {

}, [])

    const handleView = (id) => {
        navigate(`/intake/${id}`)
    }

    if (record.length === 1) {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <h3>Past Donations from {record[0].Manufacturer[0]}</h3>
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
                            <h3>{`Past Donations from ${record[0].Manufacturer[0]}`}</h3>
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