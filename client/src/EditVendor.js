import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function EditVendor() {
  const { id } = useParams();
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/vendor/${id}/edit`).then((response) => {
      if (response.data.status === 'complete') {
        response.data.data.map((key, value) => { setFormData(key) });
      }

      else if (response.data.status === 'error in query') {
        navigate('/query')
        console.error("Fail in the query")
        console.error(response.data.message)
      }
    }).catch(error => {
      navigate('/error')
      console.error(error.response.data.message)
    })
  }, [])


  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel") == true) {
        window.location.href = "/vendor";
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
    const regex_name = /^(?!.*SELECT|.*FROM|.*INSERT|.*UPDATE)(?=[a-zA-Z()\s]).*$/;
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
    try {
      const response = await Axios.put(`${process.env.REACT_APP_BACKEND_URL}/vendor/${id}/update`, {
        name: formData.BusinessName,
        phone: formData.Phone,
        email: formData.Email,
        contact: formData.ContactName,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/vendor"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
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
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  )
}

export default EditVendor;