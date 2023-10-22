import React, { useEffect } from "react";
import './App.css';
import Axios from 'axios';


function Distribution() {
  const [formData, setFormData] = React.useState(
    {
      Partner: "",
      date: "",
      source: "",
      totalItems: 0,
      value: 0,
      deliveryMethod: "",
      comments: "",
      state: true
    }
    )

    const [distributionsList, setDistributionsList] = React.useState([])

    function handleChange(event){
      setFormData(prevFormData => {
        return{
          ...prevFormData,
          [event.target.name]: event.target.value
        }
      })
    }

    useEffect(() => {
      Axios.get("http://localhost:4002/api/get").then((response) => {
        setDistributionsList(response.data)
      })
    }, [])

    function handleSubmit(e){
      e.preventDefault();
      
      Axios.post("http://localhost:4002/api/insert", {partner:formData.Partner, 
      date:formData.date, 
      source:formData.source, 
      totalitems: formData.totalItems, 
      value: formData.value, 
      deliverymethod: formData.deliveryMethod, 
      comments: formData.comments, 
      state: formData.state})

    }
  return (
    <div>
      <form id="distribution" onSubmit={handleSubmit}>
        <label htmlFor="partner">Partner</label>
        <input type="text" name="Partner" value={formData.Partner} id="partner" required onChange={handleChange}/>
        
        <label htmlFor="date">Date</label>
        <input type="date" name="date" id="date" value={formData.date} min="2023-09-01" required onChange={handleChange}/>

        <label htmlFor="source">Source</label>
        <input type="text" name="source" value={formData.source} id="source" required onChange={handleChange}/>

        <label htmlFor="total-items">Total-Items</label>
        <input type="number" name="totalItems" value={formData.totalItems} id="total-items" required onChange={handleChange}/>

        <label htmlFor="value">Value</label>
        <input type="number" id="value" value={formData.value} name="value" step=".01" onChange={handleChange}/>

        <p>Delivery Method</p>

        <label htmlFor="pickup">Pickup</label>
        <input type="radio" id="pickup" name="deliveryMethod" value="Pickup" checked={formData.deliveryMethod === "Pickup"} onChange={handleChange}/>
        <label htmlFor="delivery">Delivery</label>
        <input type="radio" id="delivery" name="deliveryMethod" value="Delivery" checked={formData.deliveryMethod === "Delivery"} onChange={handleChange}/>

        <textarea name="comments" rows="4" cols="50" onChange={handleChange} placeholder="Comments"></textarea>

        <input type="submit" value="Submit"/>

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

        
      </form>
    </div>
    
  );
}

export default App;



