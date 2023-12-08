import React, { useEffect } from "react";
import Axios from 'axios';
import {useNavigate, Link} from "react-router-dom";


function Distribution() {

  const navigate = useNavigate();
  const [partners, setPartners] = React.useState([])
  const [filters, setFilters] = React.useState({
    Partner:"",
    deliverymethod:"",
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


  const FilterDate = (event) =>{
    setRecords(distributionsList.filter(f => f.RequestDate > event.target.value))
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
              <option value={val.name}>{val.Name}</option>
            )
          })}
          
        </select>
        
        </label>
        <label>
          <input type="radio" value="All" name="deliverymethod" onChange={handleChange} checked={filters.deliverymethod == "All"}/>
          All
        </label>
        <label>
          <input type="radio" value="Drop-off" name="deliverymethod" onChange={handleChange} checked={filters.deliverymethod == "Drop-off"}/>
          Drop-off
        </label>
        <label>
          <input type="radio" value="Other" name="deliverymethod" onChange={handleChange} checked={filters.deliverymethod == "Other"}/>
          Other
        </label>
        <input type="date" onChange={handleChange} value={filters.date} name="date"/>

        <input type="submit" value="Submit"/>
      </form>
      <h2>Change ifs to == rather than include</h2>
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
          {records.map((val) => {
          return (
          <tr>
            <td>{val.Partner_id}</td>
            <td>{val.RequestDate}</td>
            <td>{val.CompletedDate}</td>
            <td>{val.DeliveryMethod}</td>
            <td>{val.Comments}</td>
            <td>{val.status}</td>
            <td>
              <button onClick={() => handleRemove(val.Order_id)}>Delete</button>
              <button onClick={() => handleEdit(val.Order_id)}>Edit</button>
              <button onClick={() => handleView(val.Order_id)}>View</button>
            </td>
          </tr>);
        })}
        </tbody>
      </table> 
      <button><Link to="/Dashboard">Dasboard</Link></button>
    </div>
    
  );
}

export default Distribution;



