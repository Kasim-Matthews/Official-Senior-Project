import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Manufacturer from "./models/Manufacturer";

function AddManufacturers() {

  const [formData, setFormData] = React.useState(Manufacturer)
  const [formErrors, setFormErrors] = useState({})

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/manufacturers";
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

  function handleSubmit() {
    try {
      Axios.post("http://localhost:3001/manufacturers/new", { name: formData.Name}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }
    catch (error) {
      console.log(error.response.data);
    }
    window.location.href = "/manufacturers";
  }

  return (
    <form id="locations" onSubmit={validate}>
      <label htmlFor="Name">Name</label>
      <input type="text" name="Name" value={formData.Name} id="Name" required onChange={handleChange} />
      {formErrors.Name ? <p>{formErrors.Name}</p> : null}
      <input type="submit" value="Submit" />
      <button onClick={handleCancel}>Cancel</button>
    </form>
  )
}

export default AddManufacturers;