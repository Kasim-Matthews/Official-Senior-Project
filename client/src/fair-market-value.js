import React, { useState, useEffect } from "react";
import Axios from 'axios';

function FairMarketValue() {

  const [product, setProduct] = React.useState("");
  const [fairMarketValue, setFairMarketValue] = React.useState(0);
  const [Date, setDate] = React.useState(0);
  const [Notes, setNotes] = React.useState(0);

    const submitFMValue = () => {
      Axios.post("http://localhost:3306/api/insert", {
        product: product, 
        fairMarketValue: fairMarketValue, 
        Date: Date, 
        Notes: Notes
      }).then(() => {
        alert("success");
      });
    }

  return (
    <div>
      <h2>Fair Market Value</h2>
      <form id="fair-market-value">
        <label htmlFor="product">Product</label>
        <input type="text" name="Product" id="product" required onChange={(e) => {setProduct(e.target.value);}}/><br></br>
        
        <label htmlFor="fmvalue">Fair Market Value</label>
        <input type="text" name="Fair Market Value" id="fmvalue" required onChange={(e) => {setFairMarketValue(e.target.value);}}/><br></br>

        <label htmlFor="Date">Date</label>
        <input type="date" name="Date" id="date" onChange={(e) => {setDate(e.target.value);}}/><br></br>

        <textarea name="notes" rows="4" cols="50" onChange={(e) => {setNotes(e.target.value);}} placeholder="Notes"></textarea><br></br>

        <button onClick={submitFMValue}>Submit</button>

      </form>
    </div>
    
  );
}

export default FairMarketValue;
