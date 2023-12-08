import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, useParams, Link} from "react-router-dom";

function ViewDistribution(){
    
    const navigate = useNavigate();
    const {id} = useParams();
    const [record, setRecord] = React.useState({})

          useEffect(() => {
            Axios.get(`http://localhost:3001/distribution/${id}/view`).then((response) => {
            response.data.map((key, value) => {setRecord(key)});
            })
          }, [])

    return(
      <div>
      <table>
        <thead>
          <tr>
            <th>Partner</th>
            <th>Requested Date</th>
            <th>Completed Date</th>
            <th>Delivery Method</th>
            <th>Comments</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {record.map((val) => {
          return (
          <tr>
            <td>{val.Partner_id}</td>
            <td>{val.RequestDate}</td>
            <td>{val.CompletedDate}</td>
            <td>{val.DeliveryMethod}</td>
            <td>{val.Comments}</td>
            <td>{val.status}</td>
          </tr>);
        })}
        </tbody>
      </table> 
      <button><Link to="/Dashboard">Dasboard</Link></button>
    </div>
    )
}

export default ViewDistribution;