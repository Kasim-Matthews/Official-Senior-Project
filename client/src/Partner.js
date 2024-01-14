import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function Partner(props) {

    const [partnerList, setPartnerList] = useState([])


    useEffect(() => {
        Axios.get("http://localhost:3001/partner").then((response) => {
            setPartnerList(response.data)
        })
    }, [])

    return (
        <div>
            <button><Link to="/partner/new">Add</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {partnerList.map((val) => {
                        return (
                            <tr>
                                <td>{val.Name}</td>
                                <td>{val.Email}</td>
                                <td>
                                    <button onClick={() => this.props.handleRemove(val.Partner_id)}>Delete</button>
                                    <button onClick={() => this.props.handleEdit(val.Partner_id)}>Edit</button>
                                    <button onClick={() => this.props.handleView(val.Partner_id)}>View</button>
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <p style={{ display: "none" }}>Make sure when doing input validation you give an error if email is already used and don't allow submit, can cause some weird errors</p>
            <button><Link to="/Dashboard">Dasboard</Link></button>
        </div>
    );
}

export default Partner;