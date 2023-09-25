import React from "react";
import './App.css';
import Axios from 'axios';


function App() {
  function handleSubmit(e){
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
  }
  return (
    <form id="distribution" method="POST" onSubmit={handleSubmit}>
      <label for="partner">Partner</label>
      <input type="text" id="partner" required/>
      
      <label for="date">Date</label>
      <input type="date" id="date" min="2023-09-01" required/>

      <label for="source">Source</label>
      <input type="text" id="source" required/>

      <label for="total-items">Total-Items</label>
      <input type="number" id="total-items" required/>

      <label for="value">Value</label>
      <input type="number" id="value" step=".01"/>

      <p>Delivery Method</p>

      <label for="pickup">Pickup</label>
      <input type="radio" id="pickup" name="delivery-method" value="Pickup"/>
      <label for="delivery">Delivery</label>
      <input type="radio" id="delivery" name="delivery-method" value="Delivery"/>

      <textarea name="comments" rows="4" cols="50">Comments</textarea>

      <input type="submit" value="Submit"/>
    </form>
  );
}

export default App;
