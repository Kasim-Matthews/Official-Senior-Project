import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewTransfer() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState([])
    const [info, setInfo] = React.useState({})


    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/transfer/${id}/view`).then((response) => {
            if (response.data.status === 'complete') {
                setRecord(response.data.data)
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
        const getInfo = async () => {
            try {
                const response = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/transfer/${id}/info`)
                if (response.data.status === 'complete') {
                    setInfo(response.data.data)

                }
                else if (response.data.status === 'error in query') {
                    navigate('/query')
                    console.error("Fail in the query")
                    console.error(response.data.message)
                }
            }
            catch (error) {
                navigate('/error')
                console.error(error.response.data.message)
            }
        }

    }, {})

    console.log(info)

    return (
        <div>

            <table>
                <thead>
                    <tr>
                        <h3>Transfer from {info.Taken} to {info.Given} on {new Date(info.Date).toISOString().slice(0, 10)}</h3>
                    </tr>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {record.map((val) => {
                        return (
                            <tr>
                                <td>{val.Item}</td>
                                <td>{val.Quantity}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    )
}


export default ViewTransfer;