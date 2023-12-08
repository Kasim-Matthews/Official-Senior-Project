import React, { useEffect } from "react";
import './Distribution.css';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";


function Distribution() {

  const navigate = useNavigate();
  const [partners, setPartners] = React.useState([])
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
    Axios.get("http://localhost:3001/distribution").then((response) => {
      setDistributionsList(response.data);
      setRecords(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get("http:////localhost:3001/partner").then((response) =>{
            setPartners(response.data);
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

  const handleRemove = (id) =>{
    Axios.delete(`http://localhost:3001/distribution/remove/${id}`);
  }

  const handleEdit = (id) => {
    navigate(`/distribution/${id}/edit`)
  }
  const handleView = (id) => {
    navigate(`/distribution/${id}`)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Partner">
        Partner
        <select id="Partner" name="Partner" value={filters.Partner} onChange={handleChange}>
          <option value="" disabled></option>
          {partners.map((val) =>{
            return(
              <option value={val.name}>{val.name}</option>
            )
          })}
          
        </select>
        
        </label>
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
            <th>Actions</th>
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
            <td>
              <button onClick={() => handleRemove(val.id)}>Delete</button>
              <button onClick={() => handleEdit(val.id)}>Edit</button>
              <button onClick={() => handleView(val.id)}>View</button>
            </td>
          </tr>);
        })}
        </tbody>
      </table> 
    </div>
    
  );
}

export default Distribution;



