import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Manufacturer from "./models/Manufacturer";

function AddManufacturers() {

  const [formData, setFormData] = React.useState(Manufacturer)
  const [formErrors, setFormErrors] = useState({})


  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/manufacturers";
    }
}

  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    const regex_name = /^(?!.*SELECT|.*FROM|.*INSERT|.*UPDATE)(?=[a-zA-Z()\s]).*$/;


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
      const response = await Axios.post("https://diaper-bank-inventory-management-system.onrender.com/manufacturers/new", { name: formData.Name }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/manufacturers";
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }
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