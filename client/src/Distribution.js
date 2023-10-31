import React, { useEffect } from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";


function Distribution() {

  const navigate = useNavigate();

  const [distributionsList, setDistributionsList] = React.useState([])
  const [records, setRecords] = React.useState([]);



  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      setDistributionsList(response.data);
      setRecords(response.data);
    })
  }, [])

  const Filter = (event) => {
    setRecords(distributionsList.filter(f => f.partner.toLowerCase().includes(event.target.value)))
  }
  return (
    <div>
      <input type="text" onChange={Filter} placeholder="Partner"/>
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
          {records.map((val) => {
          return (
          <tr>
            <td>{val.partner}</td>
            <td>{val.date}</td>
            <td>{val.source}</td>
            <td>{val.totalitems}</td>
            <td>{val.value}</td>
            <td>{val.deliverymethod}</td>
            <td>{val.comments}</td>
            <td>{val.state == true ? "Complete":"Incomplete"}</td>
          </tr>);
        })}
        </tbody>
      </table> 
    </div>
    
  );
}

export default Distribution;



