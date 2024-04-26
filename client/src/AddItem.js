import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Item from "./models/Item";

function AddItem() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState(Item)
  const [formErrors, setFormErrors] = useState({})


  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    const regex_name = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]).*$/;


    if (!regex_name.test(formData.Name)) {
      errors.Name = "The name contains an SQL keyword !"
    }
    setFormErrors(errors)
    if (!errors.Name) {
        handleSubmit()
    }
    return;
}

  async function handleSubmit() {
    try {
      const response = await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/item/new", {
        name: formData.Name,
        FairMarketValue: formData.FairMarketValue,
        PackageCount: formData.PackageCount
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      

      if(response.status == 400){
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200){
        window.location.href = "/item"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }
    

  }



  return (
    <form id="item" onSubmit={validate}>
      <label htmlFor="Name">Name</label>
      <input type="text" name="Name" value={formData.Name} id="Name" required onChange={handleChange} />
      {formErrors.Name ? <p>{formErrors.Name}</p> : null}
      <label htmlFor="FairMarketValue">Fair Market Value</label>
      <input type="number" name="FairMarketValue" id="FairMarketValue" value={formData.FairMarketValue} step="0.01" required onChange={handleChange} />

      <label htmlFor="PackageCount">Package Count</label>
      <input type="number" name="PackageCount" id="PackageCount" value={formData.PackageCount} step="1" onChange={handleChange} />


      <input type="submit" value="Submit" />
      
    </form>
    
  )
}

export default AddItem;