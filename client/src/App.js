import React from "react";
import './App.css';
import Axios from 'axios';


function App() {
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

    function handleChange(event){
      setFormData(prevFormData => {
        return{
          ...prevFormData,
          [event.target.name]: event.target.value
        }
      })
    }

    function handleSubmit(e){
      e.preventDefault();
      console.log(formData.Partner)
      console.log(formData.date)


      Axios.post("http://localhost:4002/api/insert", {partner:formData.Partner, 
      date:formData.date, 
      source:formData.source, 
      totalitems: formData.totalItems, 
      value: formData.value, 
      deliverymethod: formData.deliveryMethod, 
      comments: formData.comments, 
      state: formData.state}).then((res) => {
      console.log('Axios:', res);
      console.log('Axios data:', res.data);
    })
    }
  return (
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
    </form>
  );
}

export default App;



/*function handleSubmit(e){
    e.preventDefault();
    let currentDate = new Date();


    let partner = document.getElementById("partner");
    let date = document.getElementById("date");
    let source = document.getElementById("source");
    let totalitems = document.getElementById("total-items");
    let value = document.getElementById("value");
    let deliverymethod = document.querySelector('input[name="delivery-method"]:checked').value;
    let comments = document.getElementById("comments");

    let givenDate = new Date(date);
    let state = givenDate.getTime() < currentDate.getTime();
    

    Axios.post("http://localhost:3001/api/insert", {partner:partner, date:date, source:source, totalitems: totalitems, value: value, deliverymethod: deliverymethod, comments: comments, state: state})
  }*/