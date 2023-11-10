import React, { useEffect } from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";


function Distribution() {

  const navigate = useNavigate();

  const [filters, setFilters] = React.useState({
    Partner:"",
    deliverymethod:"",
    source:"",
    date:""
    
  })
  const [distributionsList, setDistributionsList] = React.useState([])
  const [records, setRecords] = React.useState([]);

  function handleChange(event){
    setFilters(prevFilters => {
      return{
        ...prevFilters,
        [event.target.name] : event.target.value
      }
    })
  }

  function handleSubmit(e){
    e.preventDefault();
    var temp = distributionsList;
    if(filters.Partner != ""){
      temp = temp.filter(f => f.partner.toLowerCase().includes(filters.Partner.toLowerCase()));
    }

    if(filters.deliverymethod == "Pickup"){
      temp = temp.filter(f => f.deliverymethod == filters.deliverymethod);
    }

    if(filters.deliverymethod == "Delivery"){
      temp = temp.filter(f => f.deliverymethod == filters.deliverymethod);
    }

    if(filters.date != ""){
      temp = temp.filter(f => f.date > filters.date)
    }

    if(filters.source != ""){
      temp = temp.filter(f => f.source.toLowerCase().includes(filters.source.toLowerCase()))
    }

    setRecords(temp);
  }


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
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} placeholder="Partner" name="Partner" value={filters.Partner}/>
        <label>
          <input type="radio" value="All" name="deliverymethod" onChange={handleChange} checked={filters.deliverymethod == "All"}/>
          All
        </label>
        <label>
          <input type="radio" value="Pickup" name="deliverymethod" onChange={handleChange} checked={filters.deliverymethod == "Pickup"}/>
          Pickup
        </label>
        <label>
          <input type="radio" value="Delivery" name="deliverymethod" onChange={handleChange} checked={filters.deliverymethod == "Delivery"}/>
          Delivery
        </label>
        <input type="text" onChange={handleChange} placeholder="Source" name="source" value={filters.source}/>
        <input type="date" onChange={handleChange} value={filters.date} name="date"/>

        <input type="submit" value="Submit"/>
      </form>
      <h2>Change ifs to == rather than include</h2>
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



