import React, { useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";

function ViewItem() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = React.useState({})
    const [list, setList] = React.useState([])

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/item/${id}/edit`).then((response) => {
            if (response.data.status === 'complete') {
                response.data.data.map((key, value) => { setRecord(key) });
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
        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/item/${id}/view`).then((response) => {
            if (response.data.status === 'complete') {
                setList(response.data.data)
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

    if(list.length === 0) {
        return (
            <div>
                <h2>Item Information for {record.Name}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Market Value</th>
                            <th>Package Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${record.FairMarketValue}</td>
                            <td>{typeof record.PackageCount != "object" ? record.PackageCount : null}</td>
                        </tr>
                    </tbody>
                </table>
    
                <table>
                    <thead>
                        <tr>
                            <header>This Item Is Stored at these Locations</header>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th>Storage Location</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
    
                    <tfoot>
                        <tr>
                            <th>Total</th>
                        </tr>
                    </tfoot>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    }
    else {
        const totalQuantity = list.reduce((sum, val) => sum + parseInt(val.Quantity), 0);

        return (
            <div>
                <h2>Item Information for {record.Name}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Market Value</th>
                            <th>Package Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${record.FairMarketValue}</td>
                            <td>{typeof record.PackageCount != "object" ? record.PackageCount : null}</td>
                        </tr>
                    </tbody>
                </table>
    
                <table>
                    <thead>
                        <tr>
                            <header>This Item Is Stored at these Locations</header>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th>Storage Location</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((val) => {
                            return (
                                <tr>
                                    <td>{val.Location}</td>
                                    <td>{val.Quantity}</td>
                                </tr>
                            )
                        })}
                    </tbody>
    
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <td>{totalQuantity}</td>
                        </tr>
                    </tfoot>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
        )
    } 

}

export default ViewItem;