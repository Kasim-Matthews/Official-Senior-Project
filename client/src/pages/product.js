import React, { useState, useEffect } from "react";
import Axios from 'axios';

function Product() {

  const [productName, setProductName] = React.useState("");
  const [productType, setProductType] = React.useState(0);
  const [source, setSource] = React.useState(0);
  const [description, setDescription] = React.useState(0);
  const [price, setPrice] = React.useState(0);

    const submitProduct = () => {
      Axios.post("http://localhost:3306/api/insert", {
        productName: productName, 
        productType: productType, 
        source: source, 
        description: description,
        price: price
      }).then(() => {
        alert("success");
      });
    }

  return (
    <div>
      <h2>Add Product</h2>
      <form id="add-product">
        <label htmlFor="productName">Product Name</label>
        <input type="text" name="Product Name" id="productName" required onChange={(e) => {setProductName(e.target.value);}}/><br></br>
        
        <label htmlFor="productType">Product Type</label>
        <input type="text" name="Product Type" id="productType" required onChange={(e) => {setProductType(e.target.value);}}/><br></br>

        <label htmlFor="source">Source</label>
        <input type="text" name="Source" id="source" onChange={(e) => {setSource(e.target.value);}}/><br></br>

        <textarea name="description" rows="4" cols="50" onChange={(e) => {setDescription(e.target.value);}} placeholder="Description"></textarea><br></br>

        <label htmlFor="price">Price</label>
        <input type="int" name="Price" id="price" onChange={(e) => {setPrice(e.target.value);}}/><br></br>

        <button onClick={submitProduct}>Submit</button>

      </form>
    </div>
    
  );
}

export default Product;
