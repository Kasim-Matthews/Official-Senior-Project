import React, { useEffect } from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function Partner(){
    const navigate = useNavigate();

    const [partnerList, setPartnerList] = React.useState([])

    useEffect(() => {
        Axios.get("http:////localhost:3001/partner").then((response) =>{
            setPartnerList(response.data);
        })
    })

    const handleRemove = (id) =>{
        Axios.delete(`http://localhost:3001/partner/remove/${id}`);
    }

    const handleEdit = (id) => {
        navigate(`/partner/${id}/edit`)
    }

    return(
        <div>
            <table>
                <thead>
                    <th>
                        <tr>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Comments</td>
                            <td>Actions</td>
                        </tr>
                    </th>
                </thead>
                <tbody>
                    {partnerList.map((val) => {
                        return(
                            <tr>
                                <td>{val.name}</td>
                                <td>{val.email}</td>
                                <td>{val.comments}</td>
                                <td>
                                    <button onClick={() => handleRemove(val.id)}>Delete</button>
                                    <button onClick={() => handleEdit(val.id)}>Edit</button>
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <p>Make sure when doing input validation you give an error if email is already used and don't allow submit, can cause some weird errors</p>
        </div>
    );
}

export default Partner;