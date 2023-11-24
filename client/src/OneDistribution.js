import React, { useEffect } from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

function ViewDistribution(){
    
    const navigate = useNavigate();
    const {id} = useParams();
    const [record, setRecord] = React.useState({})

          useEffect(() => {
            Axios.get(`http://localhost:3001/distribution/${id}/edit`).then((response) => {
            response.data.map((key, value) => {setRecord(key)});
            })
          }, [])

    return(
        <table>
        <thead>
          <tr>
            <th>Partner</th>
            <th>Date</th>
            <th>Source</th>
            <th>Total Items</th>
            <th>Value</th>
            <th>Delivery Method</th>
            <th>Comments</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{record.partner}</td>
            <td>{record.date}</td>
            <td>{record.source}</td>
            <td>{record.totalitems}</td>
            <td>{record.value}</td>
            <td>{record.deliverymethod}</td>
            <td>{record.comments}</td>
            <td>{record.state == true ? "Complete":"Incomplete"}</td>
          </tr>
        </tbody>
      </table>
    )
}

export default ViewDistribution;