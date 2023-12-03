import React, { useState, useEffect } from "react";
import Axios from 'axios';

function Purchase() {

  const [vendorName, setVendorName] = React.useState("");
  const [diaperQuantity, setDiaperQuantity] = React.useState(0);
  const [diaperPrice, setDiaperPrice] = React.useState(0);
  const [wipesQuantity, setWipesQuantity] = React.useState(0);
  const [wipesPrice, setWipesPrice] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [purchaseDate, setPurchaseDate] = React.useState(0);
  const [comment, setComment] = React.useState("");


    const submitPurchase = () => {
      Axios.post("http://localhost:3306/api/insert", {
        vendorName: vendorName, 
        purchaseDate: purchaseDate, 
        diaperQuantity: diaperQuantity, 
        diaperPrice: diaperPrice, 
        wipesQuantity: wipesQuantity, 
        wipesPrice: wipesPrice, 
        totalPrice: totalPrice,
        comment: comment
      }).then(() => {
        alert("success");
      });
    }

  return (
    <div>
      <h2>Purchases</h2>
      <form id="purchase">
        <label htmlFor="vendorName">Vendor Name</label>
        <input type="text" name="Vendor Name" id="vendorName" required onChange={(e) => {setVendorName(e.target.value);}}/><br></br>
        
        <label htmlFor="purchaseDate">Date of Purchase</label>
        <input type="date" name="Date of Purchase" id="purchaseDate" min="2023-09-01" required onChange={(e) => {setPurchaseDate(e.target.value);}}/><br></br>

        <label htmlFor="diaperQuantity">Number of Diapers</label>
        <input type="number" name="Number of Diapers" id="diaperQuantity" onChange={(e) => {setDiaperQuantity(e.target.value);}}/><br></br>

        <label htmlFor="diaperPrice">Price of Diapers</label>
        <input type="number" name="Price of Diapers" id="diaperPrice" step="any" onChange={(e) => {setDiaperPrice(e.target.value);}}/><br></br>

        <label htmlFor="wipesQuantity">Number of Wipes</label>
        <input type="number" name="Number of Wipes" id="wipesQuantity" onChange={(e) => {setWipesQuantity(e.target.value);}}/><br></br>

        <label htmlFor="wipesPrice">Price of Wipes</label>
        <input type="number" name="Price of Wipes" id="wipesPrice" step="any" onChange={(e) => {setWipesPrice(e.target.value);}}/><br></br>

        <label htmlFor="totalPrice">Total Price</label>
        <input type="number" name="Total Price" id="totalPrice" step="any" required onChange={(e) => {setTotalPrice(e.target.value);}}/><br></br>

        <textarea name="comment" rows="4" cols="50" onChange={(e) => {setComment(e.target.value);}} placeholder="Comment"></textarea><br></br>

        <button onClick={submitPurchase}>Submit</button>

      </form>
    </div>
    
  );
}

export default Purchase;
