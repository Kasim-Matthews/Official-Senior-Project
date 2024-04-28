import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Item from "./models/Item";

function AddItem() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState(Item)
  const [locations, setLocations] = React.useState([])
  const [formErrors, setFormErrors] = useState({})


  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/item";
    }
}

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

      await Axios.post("http://localhost:3001/item/new", {
        name: formData.Name,
        FairMarketValue: formData.FairMarketValue,
        PackageCount: formData.PackageCount
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }
    catch (error) {
      console.log(error.response.data);
    }

    let Item_id = await Axios.get("http://localhost:3001/item/last")
    
    await Axios.post("http://localhost:3001/item/pair", {Locations: locations, Item_id: Item_id.data[0].Item_id}).then(window.location.href ="/item")

    
    navigate("/item");
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/location").then((response) => {
        setLocations(response.data);
    })
}, [])

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
      <button type="button" onClick={handleCancel}>Cancel</button>
      
    </form>
    
  )
}

export default AddItem;