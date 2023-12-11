import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, useParams, Link} from "react-router-dom";

function ViewPartner(){
    
    const navigate = useNavigate();
    const {id} = useParams();
    const [record, setRecord] = React.useState({})
    


          useEffect(() => {
            Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/partner/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setRecord(key)});
            })
          }, [id])


          return(
            <div>
                    <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{record.Name}</td>
                        <td>{record.Email}</td>
                    </tr>
                    </tbody>
                </table>
                <button><Link to="/Dashboard">Dasboard</Link></button>
            </div>
          )
}

export default ViewPartner;