import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function TransferView() {
    const navigate = useNavigate();

    const [transferList, setTransferList] = React.useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/transfer").then((response) => {
            setTransferList(response.data);
        })
    }, [])

    const handleRemove = async (id, Name, Location) => {
        if (window.confirm(`Are you sure you want to delete ${Name}'s transfer from the transfer list?`) == true) {
            let GetData = async function (id) {
                return await Axios.get(`http://localhost:3001/transfer/${id}/cleanup`).then((response) => {
                    return response
                });
            }
            let data = GetData(id)
            data.then(async (response) => {
                await Axios.put("http://localhost:3001/transfer/reclaim", { records: response.data })
                await Axios.put("http://localhost:3001/transfer/renounce", { records: response.data, Location: Location })
            })

            await Axios.delete(`http://localhost:3001/intake/remove/${id}`);

            window.location.reload(false);
        }
    }

    const handleView = (id) => {
        navigate(`/transfer/${id}`)
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Date</th>
                        <th>Comments</th>
                        <th>Total Moved</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transferList.map((val) => {
                        return (
                            <tr>
                                <td>{val.Taken}</td>
                                <td>{val.Given}</td>
                                <td>{val.Date}</td>
                                <td>{val.Comments}</td>
                                <td>{val.TotalMoved}</td>
                                <td>
                                    <button onClick={() => handleRemove(val.Intake_id, val.Taken, val.Location)}>Delete</button>
                                    <button onClick={() => handleView(val.Intake_id)}>Edit</button>
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

export default TransferView;