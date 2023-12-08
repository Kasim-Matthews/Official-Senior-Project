import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

function ViewPartner(){
    
    const navigate = useNavigate();
    const {id} = useParams();
    const [record, setRecord] = React.useState({})
    


          useEffect(() => {
            Axios.get(`http://localhost:3001/partner/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setRecord(key)});
            })
          }, [id])


          return(
            <table>
                <thead>
                    <th>
                        <tr>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Comments</td>
                            <td>Agency Representative</td>
                        </tr>
                    </th>
                </thead>
                <tbody>
                <tr>
                    <td>{record.name}</td>
                    <td>{record.email}</td>
                    <td>{record.comments}</td>
                    <td>{record.representative}</td>
                </tr>
                </tbody>
            </table>
          )
}

export default ViewPartner;