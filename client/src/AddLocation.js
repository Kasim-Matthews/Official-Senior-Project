import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Location from './models/Location'
import { useNavigate } from "react-router-dom";

function AddLocation() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState(Location)
  const [items, setItems] = React.useState([])
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
    const regex_address = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]|[0-9]).*$/;


    if (!regex_name.test(formData.Name)) {
      errors.Name = "The name contains an SQL keyword or a special character!"
    }

    if (!regex_address.test(formData.Address)) {
        errors.Address = "The address contains an SQL keyword !"
      }
    setFormErrors(errors)
    if (!errors.Name && !errors.Address) {
        handleSubmit()
    }
    return;
}
  
  async function handleSubmit() {
    try {
      Axios.post("http://localhost:3001/location/new", {
        name: formData.Name,
        Address: formData.Address
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }
    catch (error) {
      console.log(error.response.data);
    }

    
    let Location_id = await Axios.get("http://localhost:3001/location/last")
    let ptype = await Axios.get("http://localhost:3001/location/adjustment");

    await Axios.post("http://localhost:3001/location/partner", {name: formData.Name, address: formData.Address, Type: ptype.data[0].PartnerType_id, Location: Location_id.data[0].Location_id})
    await Axios.post("http://localhost:3001/location/pair", {Location_id: Location_id.data[0].Location_id, Items: items}).then(window.location.href ="/location")


    
  }

  React.useEffect(() => {
    Axios.get("http://localhost:3001/item").then((response) => {
        setItems(response.data);
    })
}, [])

  return (
    <form id="locations" onSubmit={validate}>
      <label htmlFor="Name">Name</label>
      <input type="text" name="Name" value={formData.Name} id="Name" required onChange={handleChange} />
      {formErrors.Name ? <p>{formErrors.Name}</p> : null}
      <label htmlFor="Address">Address</label>
      <input type="text" name="Address" value={formData.Address} id="Address" required onChange={handleChange} />
      {formErrors.Address ? <p>{formErrors.Address}</p> : null}

      <input type="submit" value="Submit" />
    </form>
  )
}

export default AddLocation;