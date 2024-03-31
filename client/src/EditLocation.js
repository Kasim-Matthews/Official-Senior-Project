import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";

function EditLocation() {

  const { id } = useParams();
  const [formData, setFormData] = React.useState({})
  const [formErrors, setFormErrors] = useState({})




  function handleChange(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  useEffect(() => {
    Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/location/${id}/edit`).then((response) => {
      response.data.map((key, value) => { setFormData(key) });
    })
  }, [])


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


  function handleSubmit() {

    Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/location/${id}/update`, {
      name: formData.Name,
      Address: formData.Address
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    window.location.href = "/location";

  }
  return (
    <form id="edit location Form" onSubmit={validate}>
      <label htmlFor="Name">Name</label>
      <input type="text" name="Name" defaultValue={formData.Name} id="Name" required onChange={handleChange} />
      {formErrors.Name ? <p>{formErrors.Name}</p> : null}

      <label htmlFor="Adress">Address</label>
      <input type="text" name="Address" defaultValue={formData.Address} id="Address" required onChange={handleChange} />
      {formErrors.Address ? <p>{formErrors.Address}</p> : null}
      
      <input type="submit" value="Submit" />
    </form>
  )
}

export default EditLocation;