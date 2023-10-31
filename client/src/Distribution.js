import React, { useEffect } from "react";
import './Distribution.css';
import Axios from 'axios';


function Distribution() {


    const [distributionsList, setDistributionsList] = React.useState([])



    useEffect(() => {
      Axios.get("http://localhost:4002/api/get").then((response) => {
        setDistributionsList(response.data)
      })
    }, [])

  return (
    <div>
      
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
          {distributionsList.map((val) => {
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



