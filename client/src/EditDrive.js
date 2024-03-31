import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";


function EditDrive() {
  const { id } = useParams();
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})


  useEffect(() => {
    Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/productdrive/${id}/edit`).then((response) => {
      response.data.map((key, value) => { setFormData(key) });
    })
  }, [])

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
  }

  async function handleSubmit() {
    await Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/productdrive/${id}/update`, {
      name: formData.Name
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(window.location.href = "/Dashboard");
  }

  return (
    <div>
      <form onSubmit={validate}>
        <label htmlFor="Name">Name</label>
        <input type="text" name="Name" id="Name" defaultValue={formData.Name} required onChange={handleChange} />
        {formErrors.Name ? <p>{formErrors.Name}</p> : null}

        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default EditDrive;