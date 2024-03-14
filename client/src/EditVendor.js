import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";


function EditVendor() {
  const { id } = useParams();
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    Axios.get(`http://localhost:3001/vendor/${id}/edit`).then((response) => {
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
    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regex_phone = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/

    if (!regex_name.test(formData.BusinessName)) {
      errors.Name = "The name contains an SQL keyword !"
    }

    if (!regex_email.test(formData.Email) && formData.Email != "") {
      errors.Email = "This is not a valid email format!";
    }

    if (!regex_phone.test(formData.Phone) && formData.Phone != "") {
      errors.Phone = "This is not a valid phone number format!"
    }

    if (!regex_name.test(formData.ContactName) && formData.ContactName != "") {
      errors.ContactName = "The contact name contains an SQL keyword!"
    }
    setFormErrors(errors)
    if (!errors.Name && !errors.Email && !errors.Phone && !errors.ContactName) {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    if (!formErrors.Name && !formErrors.Email && !formErrors.Phone && !formErrors.ContactName) {
      await Axios.post(`http://localhost:3001/vendor/${id}/update`, {
        name: formData.BusinessName,
        phone: formData.Phone,
        email: formData.Email,
        contact: formData.ContactName,
        type: formData.Type
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      window.location.href = "/vendor";
    }
  }

  return (
    <div>
      <form onSubmit={validate}>
        <label htmlFor="BusinessName">Business Name</label>
        <input type="text" name="BusinessName" id="BusinessName" defaultValue={formData.BusinessName} required onChange={handleChange} />
        {formErrors.Name ? <p>{formErrors.Name}</p> : null}
        <label htmlFor="ContactName">Contact Name</label>
        <input type="text" name="ContactName" id="ContactName" defaultValue={formData.ContactName} onChange={handleChange} />
        {formErrors.ContactName ? <p>{formErrors.ContactName}</p> : null}
        <label htmlFor="Phone">Phone</label>
        <input type="text" name="Phone" id="Phone" defaultValue={formData.Phone} placeholder="XXX-XXX-XXXX" onChange={handleChange} />
        {formErrors.Phone ? <p>{formErrors.Phone}</p> : null}
        <label htmlFor="Email">Email</label>
        <input type="text" name="Email" id="Email" defaultValue={formData.Email} onChange={handleChange} />
        {formErrors.Email ? <p>{formErrors.Email}</p> : null}


        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default EditVendor;