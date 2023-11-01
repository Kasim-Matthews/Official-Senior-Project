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
  };

  const FilterRadio = (event) =>{
    setRecords(distributionsList.filter(f => f.deliverymethod.includes(event.target.value)))
  };

  const FilterRadioReset = (event) =>{
    setRecords(distributionsList)
  }
  const FilterSource = (event) => {
    setRecords(distributionsList.filter(f => f.source.toLowerCase().includes(event.target.value)))
  };

  const FilterDate = (event) =>{
    setRecords(distributionsList.filter(f => f.date > event.target.value))
  }

  return (
    <div>
      <input type="text" onChange={Filter} placeholder="Partner"/>
      <label>
        <input type="radio" value="all" name="deliverymethod" onChange={FilterRadioReset}/>
        All
      </label>
      <label>
        <input type="radio" value="Pickup" name="deliverymethod" onChange={FilterRadio}/>
        Pickup
      </label>
      <label>
        <input type="radio" value="Delivery" name="deliverymethod" onChange={FilterRadio}/>
        Delivery
      </label>
      <input type="text" onChange={FilterSource} placeholder="Source"/>
      <input type="date" onChange={FilterDate}/>
      <h2>Add all these filters into a form so it can filter the data by all the parameters at once instead of one or the other</h2>
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



