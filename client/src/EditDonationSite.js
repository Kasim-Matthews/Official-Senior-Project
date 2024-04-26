import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

function EditDonationSite() {
  const { id } = useParams();
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`https://diaper-bank-inventory-management-system.onrender.com/donationsite/${id}/edit`).then((response) => {
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
        window.location.href = "/donationsite";
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
    const regex_address = /^(?!.*SELECT|.*FROM)(?=[a-zA-Z()\s]|[0-9]).*$/;


    if (!regex_name.test(formData.Name)) {
      errors.Name = "The name contains an SQL keyword!"
    }

    if (!regex_address.test(formData.Address)) {
      errors.Address = "The address contains an SQL keyword!"
    }
    setFormErrors(errors)
    if (!errors.Name && !errors.Address) {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    try {
      const response = await Axios.put(`https://diaper-bank-inventory-management-system.onrender.com/donationsite/${id}/update`, {
        name: formData.Name,
        address: formData.Address
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      if (response.status == 400) {
        alert("Check the values you input. One of the values are not of the correct type.")
      }

      else if (response.status == 200) {
        window.location.href = "/donationsite"
      }
    }

    catch (error) {
      alert("Server side error/Contact developer")
    }

  }

  return (
    <div>
      <form onSubmit={validate}>
        <label htmlFor="Name">Name</label>
        <input type="text" name="Name" id="Name" defaultValue={formData.Name} required onChange={handleChange} />
        {formErrors.Name ? <p>{formErrors.Name}</p> : null}

        <label htmlFor="Address">Address</label>
        <input type="text" name="Address" id="Address" defaultValue={formData.Address} required onChange={handleChange} />
        {formErrors.Address ? <p>{formErrors.Address}</p> : null}

        <input type="submit" value="Submit" />
        <button onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  )
}

export default EditDonationSite;